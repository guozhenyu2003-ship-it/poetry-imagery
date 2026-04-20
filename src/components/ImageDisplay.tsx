'use client';

import Image from 'next/image';
import type { FlowStatus } from '@/types/poetry';
import { LoadingInk } from './LoadingInk';

interface ImageDisplayProps {
  imageUrl: string | null;
  status: FlowStatus;
}

const LOADING_MESSAGES: Partial<Record<FlowStatus, string>> = {
  generating: '正在构图……',
  polling: '意境生成中，请稍候……',
};

export function ImageDisplay({ imageUrl, status }: ImageDisplayProps) {
  const isLoading = status === 'generating' || status === 'polling';

  if (!isLoading && !imageUrl) return null;

  return (
    <div className="ink-card overflow-hidden animate-fade-in-up">
      {isLoading ? (
        <div className="aspect-square flex items-center justify-center min-h-48">
          <LoadingInk message={LOADING_MESSAGES[status]} />
        </div>
      ) : imageUrl ? (
        <div className="relative">
          <div className="aspect-square relative animate-fade-in">
            <Image
              src={imageUrl}
              alt="诗词意境图"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="p-4 flex justify-end">
            <a
              href={imageUrl}
              download="poetry-imagery.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/70 hover:text-gold text-xs font-sans tracking-widest
                         transition-colors border border-gold/20 hover:border-gold/50
                         px-4 py-1.5 rounded-sm"
            >
              下载图片
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
