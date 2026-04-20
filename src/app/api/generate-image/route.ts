export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { submitImageTask } from '@/lib/dashscope-wan';

export async function POST(req: NextRequest) {
  try {
    const { imagePrompt } = await req.json();

    if (!imagePrompt || typeof imagePrompt !== 'string' || imagePrompt.trim().length === 0) {
      return NextResponse.json({ error: '缺少图像生成提示词' }, { status: 400 });
    }

    const taskId = await submitImageTask(imagePrompt);
    return NextResponse.json({ taskId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `图像生成提交失败：${message}` }, { status: 502 });
  }
}
