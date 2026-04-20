'use client';

import { useState, useCallback } from 'react';
import type { PoetryFlowState, PoetryAnalysis } from '@/types/poetry';

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

async function pollUntilDone(
  taskId: string,
  onUpdate: (partial: Partial<PoetryFlowState>) => void
): Promise<void> {
  const MAX_ATTEMPTS = 30;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    // Exponential backoff: 3s, 4.5s, 6.75s, ... capped at 10s
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
    // PENDING / RUNNING — keep polling
  }

  onUpdate({ status: 'error', error: '图像生成超时（约5分钟），请重试' });
}

export function usePoetryFlow() {
  const [state, setState] = useState<PoetryFlowState>(IDLE_STATE);

  const update = useCallback((partial: Partial<PoetryFlowState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const run = useCallback(async (poem: string) => {
    setState({ status: 'analyzing', analysis: null, imageUrl: null, taskId: null, error: null });

    // Step 1: Analyze poetry
    let analysis: PoetryAnalysis;
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poem }),
      });
      const data = await res.json();
      if (!res.ok) {
        update({ status: 'error', error: data.error ?? '诗词分析失败，请重试' });
        return;
      }
      analysis = data.analysis;
    } catch {
      update({ status: 'error', error: '网络错误，请检查连接后重试' });
      return;
    }

    update({ status: 'generating', analysis });

    // Step 2: Submit image generation task
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

    // Step 3: Poll for result
    await pollUntilDone(taskId, update);
  }, [update]);

  const reset = useCallback(() => {
    setState(IDLE_STATE);
  }, []);

  return { state, run, reset };
}
