export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { pollImageTask } from '@/lib/dashscope-wan';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: '缺少taskId参数' }, { status: 400 });
    }

    const result = await pollImageTask(taskId);

    if (result.status === 'SUCCEEDED') {
      return NextResponse.json({ status: 'SUCCEEDED', imageUrl: result.imageUrl });
    }
    if (result.status === 'FAILED') {
      return NextResponse.json({ status: 'FAILED', error: result.errorMsg });
    }
    return NextResponse.json({ status: result.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `查询失败：${message}` }, { status: 502 });
  }
}
