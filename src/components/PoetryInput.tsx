'use client';

import { useState } from 'react';
import type { FlowStatus } from '@/types/poetry';

interface PoetryInputProps {
  onSubmit: (poem: string) => void;
  status: FlowStatus;
}

const STATUS_LABELS: Partial<Record<FlowStatus, string>> = {
  analyzing: '正在解析诗词……',
  generating: '正在构图……',
  polling: '意境生成中……',
};

export function PoetryInput({ onSubmit, status }: PoetryInputProps) {
  const [poem, setPoem] = useState('');
  const isDisabled = status !== 'idle' && status !== 'done' && status !== 'error';
  const buttonLabel = STATUS_LABELS[status] ?? '探寻意境';

  function handleSubmit() {
    if (!poem.trim()) return;
    onSubmit(poem);
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={poem}
        onChange={e => setPoem(e.target.value)}
        disabled={isDisabled}
        placeholder="请输入古诗词……"
        rows={8}
        className="w-full bg-ink-800/60 border border-ink-300/20 rounded-sm px-4 py-3
                   text-ink-50 font-serif text-base leading-loose placeholder-ink-300/40
                   focus:outline-none focus:border-gold/40 transition-colors resize-none
                   disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex items-center justify-between gap-4">
        <span className="text-ink-300/50 text-xs font-sans">{poem.length} / 2000</span>
        <button
          onClick={handleSubmit}
          disabled={isDisabled || !poem.trim()}
          className="bg-cinnabar hover:bg-cinnabar-light text-ink-50 font-serif
                     tracking-widest px-8 py-2.5 rounded-sm transition-all duration-300
                     disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
