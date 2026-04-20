'use client';

import { useState, useCallback } from 'react';
import type { PoetryFlowState, PoetryAnalysis } from '@/types/poetry';
import { extractJson } from '@/lib/poetry-prompt';

const IDLE_STATE: PoetryFlowState = {
  status: 'idle',
  analysis: null,
  imageUrl: null,
  taskId: null,
  error: null,
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readStreamToText(res: Response): Promise<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const delta: string = parsed?.choices?.[0]?.delta?.content ?? '';
        if (delta) fullText += delta;
      } catch {
        // skip malformed SSE chunks
      }
    }
  }

  return fullText;
}

async function pollUntilDone(
  taskId: string,
  onUpdate: (partial: Partial<PoetryFlowState>) => void
): Promise<void> {
  const MAX_ATTEMPTS = 30;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const delay = i === 0 ? 3000 : Math.min(3000 * Math.pow(1.5, i), 10000);
    await sleep(delay);

    const res = await fetch(`/api/poll-image?taskId=${encodeURIComponent(taskId)}`);
    const data = await res.json();

    if (data.status === 'SUCCEEDED') {
      onUpdate({ status: 'done', imageUrl: data.imageUrl });
      return;
    }
    if (data.status === 'FAILED') {
      onUpdate({ status: 'error', error: data.error ?? '图像生成失败，请重试' });
      return;
    }
  }

  onUpdate({ status: 'error', error: '图像生成超时，请重试' });
}

export function usePoetryFlow() {
  const [state, setState] = useState<PoetryFlowState>(IDLE_STATE);

  const update = useCallback((partial: Partial<PoetryFlowState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const run = useCallback(async (poem: string) => {
    setState({ status: 'analyzing', analysis: null, imageUrl: null, taskId: null, error: null });

    // Step 1: Stream Qwen analysis
    let analysis: PoetryAnalysis;
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poem }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        update({ status: 'error', error: data.error ?? '诗词分析失败，请重试' });
        return;
      }

      const rawText = await readStreamToText(res);
      analysis = extractJson(rawText) as PoetryAnalysis;
    } catch (err) {
      update({ status: 'error', error: `分析失败：${err instanceof Error ? err.message : '请重试'}` });
      return;
    }

    update({ status: 'generating', analysis });

    // Step 2: Submit image task
    let taskId: string;
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePrompt: analysis.image_prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        update({ status: 'error', error: data.error ?? '图像生成提交失败，请重试' });
        return;
      }
      taskId = data.taskId;
    } catch {
      update({ status: 'error', error: '网络错误，请检查连接后重试' });
      return;
    }

    update({ status: 'polling', taskId });

    // Step 3: Poll
    await pollUntilDone(taskId, update);
  }, [update]);

  const reset = useCallback(() => setState(IDLE_STATE), []);

  return { state, run, reset };
}
