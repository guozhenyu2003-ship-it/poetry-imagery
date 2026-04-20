import { dashScopeHeaders } from './dashscope-auth';
import { SYSTEM_PROMPT, buildUserPrompt, extractJson } from './poetry-prompt';
import type { PoetryAnalysis } from '@/types/poetry';

const QWEN_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export async function analyzePoetry(poem: string): Promise<PoetryAnalysis> {
  const body = JSON.stringify({
    model: 'qwen-max',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(poem) },
    ],
  });

  const res = await fetch(QWEN_URL, {
    method: 'POST',
    headers: dashScopeHeaders(),
    body,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Qwen API error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const content: string = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Qwen returned empty content');

  return extractJson(content) as PoetryAnalysis;
}
