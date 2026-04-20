'use client';

import type { PoetryAnalysis } from '@/types/poetry';
import { StyleBadge } from './StyleBadge';

interface AnalysisDisplayProps {
  analysis: PoetryAnalysis;
}

export function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  return (
    <div className="ink-card p-6 animate-fade-in-up space-y-5">
      {/* Title + Author + Dynasty */}
      <div className="space-y-1">
        <h2 className="text-2xl font-serif text-ink-50 tracking-wider">
          {analysis.title}
        </h2>
        <p className="text-ink-200/70 text-sm font-serif tracking-widest">
          {analysis.author} · {analysis.dynasty}
        </p>
      </div>

      {/* Style badge + explanation */}
      <div className="flex flex-wrap items-start gap-3">
        <StyleBadge style={analysis.style} />
        <p className="text-ink-200/80 text-sm font-serif leading-relaxed italic flex-1 min-w-0">
          {analysis.style_explanation}
        </p>
      </div>

      {/* Divider */}
      <hr className="brush-divider" />

      {/* Imagery */}
      <div className="space-y-1.5">
        <h3 className="text-gold text-xs font-sans tracking-widest uppercase">意　象</h3>
        <p className="text-ink-100 font-serif text-sm leading-loose">{analysis.imagery}</p>
      </div>

      {/* Analysis */}
      <div className="space-y-1.5">
        <h3 className="text-gold text-xs font-sans tracking-widest uppercase">赏　析</h3>
        <p className="text-ink-100 font-serif text-sm leading-loose">{analysis.analysis}</p>
      </div>
    </div>
  );
}
