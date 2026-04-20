export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { analyzePoetry } from '@/lib/dashscope-qwen';

export async function POST(req: NextRequest) {
  try {
    const { poem } = await req.json();

    if (!poem || typeof poem !== 'string' || poem.trim().length === 0) {
      return NextResponse.json({ error: '请输入古诗词内容' }, { status: 400 });
    }
    if (poem.length > 2000) {
      return NextResponse.json({ error: '诗词内容过长，请控制在2000字以内' }, { status: 400 });
    }

    const analysis = await analyzePoetry(poem);
    return NextResponse.json({ analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('JSON')) {
      return NextResponse.json({ error: '分析结果解析失败，请重试' }, { status: 422 });
    }
    return NextResponse.json({ error: `分析失败：${message}` }, { status: 502 });
  }
}
