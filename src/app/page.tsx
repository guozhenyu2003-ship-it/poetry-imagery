'use client';

import { usePoetryFlow } from '@/hooks/usePoetryFlow';
import { PoetryInput } from '@/components/PoetryInput';
import { AnalysisDisplay } from '@/components/AnalysisDisplay';
import { ImageDisplay } from '@/components/ImageDisplay';
import { ErrorBanner } from '@/components/ErrorBanner';

export default function Home() {
  const { state, run, reset } = usePoetryFlow();

  const showResults = state.analysis || state.status === 'generating' || state.status === 'polling';

  return (
    <div className="min-h-screen px-4 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center mb-12 space-y-3">
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-[0.3em] text-ink-50">
          诗歌意境生图
        </h1>
        <p className="text-ink-200/60 font-serif tracking-widest text-sm">
          以古诗词意境，生水墨丹青
        </p>
        <div className="w-24 mx-auto brush-divider mt-4" />
      </header>

      {/* Error banner */}
      {state.status === 'error' && state.error && (
        <div className="mb-6">
          <ErrorBanner error={state.error} onDismiss={reset} />
        </div>
      )}

      {/* Main layout */}
      <div className="space-y-8">
        {/* Input + Analysis row */}
        <div className={`grid gap-6 ${showResults && state.analysis ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {/* Poetry input */}
          <div className="ink-card p-6">
            <h2 className="text-gold/80 text-xs font-sans tracking-widest mb-4">输入诗词</h2>
            <PoetryInput onSubmit={run} status={state.status} />
          </div>

          {/* Analysis (shown after analysis is ready) */}
          {state.analysis && (
            <AnalysisDisplay analysis={state.analysis} />
          )}

          {/* Analysis skeleton during loading */}
          {(state.status === 'analyzing') && (
            <div className="ink-card p-6 space-y-4 animate-pulse">
              <div className="h-7 bg-ink-300/10 rounded w-1/2" />
              <div className="h-4 bg-ink-300/10 rounded w-1/3" />
              <div className="h-px bg-gold/10" />
              <div className="space-y-2">
                <div className="h-4 bg-ink-300/10 rounded" />
                <div className="h-4 bg-ink-300/10 rounded w-5/6" />
                <div className="h-4 bg-ink-300/10 rounded w-4/6" />
              </div>
            </div>
          )}
        </div>

        {/* Image display */}
        {showResults && (
          <div className="max-w-xl mx-auto w-full">
            <ImageDisplay imageUrl={state.imageUrl} status={state.status} />
          </div>
        )}
      </div>

      {/* Rice-paper bottom decoration */}
      <PaperFooter />
    </div>
  );
}

function PaperFooter() {
  return (
    <div className="mt-20 -mx-4">
      {/* Gradient transition: ink → paper */}
      <div
        className="h-20 w-full"
        style={{
          background: 'linear-gradient(to bottom, #1a0f09 0%, #3a2010 40%, #c8aa72 100%)',
        }}
      />

      {/* Rice-paper section */}
      <div
        className="relative overflow-hidden py-8 px-6"
        style={{
          background: '#f2e4c0',
          backgroundImage: [
            // subtle paper grain via radial gradients
            'radial-gradient(ellipse at 30% 50%, rgba(180,140,60,0.06) 0%, transparent 60%)',
            'radial-gradient(ellipse at 70% 30%, rgba(160,120,40,0.05) 0%, transparent 50%)',
          ].join(', '),
        }}
      >
        {/* 祥云 SVG pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 140"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Cloud pattern repeated across width */}
          {[60, 220, 420, 620, 820, 1020, 1150].map((cx, i) => (
            <Cloud key={i} cx={cx} cy={i % 2 === 0 ? 55 : 75} scale={0.9 + (i % 3) * 0.15} />
          ))}
          {/* Second row, offset */}
          {[140, 330, 530, 730, 930, 1110].map((cx, i) => (
            <Cloud key={`b${i}`} cx={cx} cy={i % 2 === 0 ? 105 : 90} scale={0.7 + (i % 3) * 0.12} opacity={0.12} />
          ))}
        </svg>

        {/* Footer text */}
        <div className="relative z-10 text-center space-y-2 py-2">
          <div
            className="w-24 h-px mx-auto"
            style={{ background: 'linear-gradient(to right, transparent, rgba(160,120,40,0.4), transparent)' }}
          />
          <p className="text-ink-500/50 text-xs font-sans tracking-widest pt-2">
            由通义千问解析 · wan2.7-image-pro 绘图
          </p>
        </div>
      </div>
    </div>
  );
}

function Cloud({
  cx,
  cy,
  scale = 1,
  opacity = 0.16,
}: {
  cx: number;
  cy: number;
  scale?: number;
  opacity?: number;
}) {
  const s = scale * 38;
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={opacity} fill="#b8922e">
      {/* Main cloud body */}
      <path
        d={`
          M ${-s * 1.1} ${s * 0.22}
          C ${-s * 1.1} ${-s * 0.1}
            ${-s * 0.82} ${-s * 0.35}
            ${-s * 0.45} ${-s * 0.35}
          C ${-s * 0.38} ${-s * 0.7}
            ${-s * 0.1} ${-s * 0.92}
            ${s * 0.22} ${-s * 0.92}
          C ${s * 0.6} ${-s * 0.92}
            ${s * 0.88} ${-s * 0.68}
            ${s * 0.92} ${-s * 0.35}
          C ${s * 1.22} ${-s * 0.38}
            ${s * 1.5} ${-s * 0.12}
            ${s * 1.5} ${s * 0.22}
          C ${s * 1.5} ${s * 0.6}
            ${s * 1.2} ${s * 0.85}
            ${s * 0.8} ${s * 0.85}
          L ${-s * 0.68} ${s * 0.85}
          C ${-s * 0.92} ${s * 0.85}
            ${-s * 1.1} ${s * 0.58}
            ${-s * 1.1} ${s * 0.22}
          Z
        `}
      />
      {/* Left spiral curl */}
      <path
        d={`M ${-s * 1.1} ${s * 0.22}
            C ${-s * 1.4} ${s * 0.05}
              ${-s * 1.55} ${-s * 0.25}
              ${-s * 1.3} ${-s * 0.45}
            C ${-s * 1.08} ${-s * 0.62}
              ${-s * 0.82} ${-s * 0.5}
              ${-s * 0.85} ${-s * 0.3}`}
        fill="none"
        stroke="#b8922e"
        strokeWidth={scale * 2.2}
        strokeLinecap="round"
      />
      {/* Right spiral curl */}
      <path
        d={`M ${s * 1.5} ${s * 0.22}
            C ${s * 1.8} ${s * 0.05}
              ${s * 1.95} ${-s * 0.25}
              ${s * 1.7} ${-s * 0.45}
            C ${s * 1.48} ${-s * 0.62}
              ${s * 1.22} ${-s * 0.5}
              ${s * 1.25} ${-s * 0.3}`}
        fill="none"
        stroke="#b8922e"
        strokeWidth={scale * 2.2}
        strokeLinecap="round"
      />
    </g>
  );
}
