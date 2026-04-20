import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '诗歌意境生图',
  description: '以古诗词意境，生水墨丹青',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen bg-ink-900">
        {/* Ink-wash gradient overlay */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, rgba(71,48,28,0.4) 0%, transparent 60%), ' +
              'radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%)',
          }}
        />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
