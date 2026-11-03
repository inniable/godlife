import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '갓생살기 | 하루 목표 & 습관 트래커',
  description: '부담 없이 기록하고 공유하는 Z세대 하루 목표 & 습관 트래커',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '갓생살기',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#8B5CF6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased selection:bg-violet-100 selection:text-violet-900 font-sans">
        {children}
      </body>
    </html>
  );
}
