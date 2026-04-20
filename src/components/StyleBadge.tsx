'use client';

import type { PoeticStyle } from '@/types/poetry';

const STYLE_COLORS: Record<PoeticStyle, string> = {
  雄浑: 'bg-cinnabar/20 text-cinnabar-light border-cinnabar/30',
  豪放: 'bg-cinnabar/20 text-cinnabar-light border-cinnabar/30',
  劲健: 'bg-cinnabar/20 text-cinnabar-light border-cinnabar/30',
  绚烂: 'bg-cinnabar/20 text-cinnabar-light border-cinnabar/30',
  典雅: 'bg-gold/20 text-gold-light border-gold/30',
  高古: 'bg-gold/20 text-gold-light border-gold/30',
  洗炼: 'bg-gold/20 text-gold-light border-gold/30',
  精神: 'bg-gold/20 text-gold-light border-gold/30',
  缜密: 'bg-gold/20 text-gold-light border-gold/30',
  冲淡: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  自然: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  疏野: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  飘逸: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  旷达: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  绮丽: 'bg-teal-900/30 text-teal-300 border-teal-700/30',
  清奇: 'bg-teal-900/30 text-teal-300 border-teal-700/30',
  形容: 'bg-teal-900/30 text-teal-300 border-teal-700/30',
  流动: 'bg-teal-900/30 text-teal-300 border-teal-700/30',
  沉郁: 'bg-ink-500/40 text-ink-200 border-ink-300/30',
  含蓄: 'bg-ink-500/40 text-ink-200 border-ink-300/30',
  委曲: 'bg-ink-500/40 text-ink-200 border-ink-300/30',
  实境: 'bg-ink-500/40 text-ink-200 border-ink-300/30',
  悲慨: 'bg-ink-500/40 text-ink-200 border-ink-300/30',
  超诣: 'bg-ink-500/40 text-ink-200 border-ink-300/30',
};

export function StyleBadge({ style }: { style: PoeticStyle }) {
  const colors = STYLE_COLORS[style] ?? 'bg-ink-500/40 text-ink-200 border-ink-300/30';
  return (
    <span className={`inline-block border px-3 py-1 text-sm font-serif tracking-widest rounded-sm ${colors}`}>
      {style}
    </span>
  );
}
