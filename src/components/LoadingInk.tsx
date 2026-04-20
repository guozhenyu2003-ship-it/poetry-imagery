'use client';

interface LoadingInkProps {
  message?: string;
}

export function LoadingInk({ message = '意境生成中……' }: LoadingInkProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full bg-gold/30 animate-ink-spread" />
        <span className="absolute inset-2 rounded-full bg-gold/20 animate-ink-spread [animation-delay:0.6s]" />
        <span className="absolute inset-4 rounded-full bg-gold/40" />
      </div>
      <p className="text-ink-200 font-serif tracking-widest text-sm">{message}</p>
    </div>
  );
}
