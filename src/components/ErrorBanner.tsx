'use client';

interface ErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-3 bg-cinnabar-dark/30 border border-cinnabar/40 rounded-sm px-4 py-3 animate-fade-in-up">
      <span className="text-cinnabar-light text-lg mt-0.5 select-none">✕</span>
      <p className="flex-1 text-cinnabar-light font-serif text-sm leading-relaxed">{error}</p>
      <button
        onClick={onDismiss}
        className="text-cinnabar/60 hover:text-cinnabar-light transition-colors text-xs font-serif tracking-wider"
      >
        关闭
      </button>
    </div>
  );
}
