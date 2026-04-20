import { dashScopeHeaders } from './dashscope-auth';

const WAN_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation';
const TASK_URL = 'https://dashscope.aliyuncs.com/api/v1/tasks/';

export async function submitImageTask(imagePrompt: string): Promise<string> {
  const body = JSON.stringify({
    model: 'wan2.7-image-pro',
    input: {
      messages: [
        { role: 'user', content: [{ type: 'text', text: imagePrompt }] },
      ],
    },
    parameters: { size: '1024*1024', n: 1 },
  });

  const res = await fetch(WAN_URL, {
    method: 'POST',
    headers: dashScopeHeaders({ 'X-DashScope-Async': 'enable' }),
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Wan2.7 submit error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const taskId: string = json?.output?.task_id;
  if (!taskId) throw new Error(`No task_id in response: ${JSON.stringify(json)}`);
  return taskId;
}

export type TaskPollResult =
  | { status: 'PENDING' | 'RUNNING' }
  | { status: 'SUCCEEDED'; imageUrl: string }
  | { status: 'FAILED'; errorMsg: string };

export async function pollImageTask(taskId: string): Promise<TaskPollResult> {
  const res = await fetch(TASK_URL + taskId, {
    headers: { 'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Poll error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const output = json?.output;

  if (output?.task_status === 'SUCCEEDED') {
    const imageUrl: string =
      output?.choices?.[0]?.message?.content?.[0]?.image ??
      output?.results?.[0]?.url ??
      output?.url;
    if (!imageUrl) throw new Error('SUCCEEDED but no image URL found');
    return { status: 'SUCCEEDED', imageUrl };
  }

  if (output?.task_status === 'FAILED') {
    return { status: 'FAILED', errorMsg: output?.message ?? output?.code ?? '生成失败' };
  }

  return { status: output?.task_status ?? 'PENDING' };
}
