export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { dashScopeHeaders } from '@/lib/dashscope-auth';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/poetry-prompt';

const QWEN_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { poem } = await req.json();

    if (!poem || typeof poem !== 'string' || poem.trim().length === 0) {
      return Response.json({ error: '请输入古诗词内容' }, { status: 400 });
    }
    if (poem.length > 2000) {
      return Response.json({ error: '诗词内容过长，请控制在2000字以内' }, { status: 400 });
    }

    const body = JSON.stringify({
      model: 'qwen-max',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(poem) },
      ],
      stream: true,
    });

    const upstream = await fetch(QWEN_URL, {
      method: 'POST',
      headers: dashScopeHeaders(),
      body,
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return Response.json({ error: `分析失败：${errText}` }, { status: 502 });
    }

    // Pipe SSE stream directly to client — keeps connection alive, bypasses timeout
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `分析失败：${message}` }, { status: 502 });
  }
}
