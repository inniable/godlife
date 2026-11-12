'use client';

import React, { useState } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  adUnitId?: string; // Google AdMob Banner Unit ID (Production)
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  className = '',
  adUnitId = process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111' // Google AdMob Test Unit ID
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className={`w-full max-w-4xl mx-auto my-6 px-4 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 shadow-sm border border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 tracking-wider shrink-0">
              AD
            </span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-100 truncate flex items-center gap-1.5">
                <span>오늘 하루도 갓생 완료! 스폰서 추천 혜택</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                Google AdMob 공식 배너 광고 연동 영역 (320x50 / 320x100 호환)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href="https://admob.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-[11px] font-semibold transition-all flex items-center gap-1"
              title="AdMob 안내"
            >
              <span>더 알아보기</span>
              <ExternalLink className="w-3 h-3 text-slate-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
