'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Sparkles, AlertCircle } from 'lucide-react';
import { useGoalStore } from '@/store/useGoalStore';
import { toPng } from 'html-to-image';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import confetti from 'canvas-confetti';
import { formatDurationKorean, formatSecondsToTime } from '@/lib/utils';

export const ShareCardModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, selectedDate, todos, dailyLogs } = useGoalStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!isShareModalOpen) return null;

  const currentLog = dailyLogs[selectedDate];
  const dayTodos = todos.filter((t) => t.due_date === selectedDate && !t.is_inbox);
  const completedCount = dayTodos.filter((t) => t.is_completed).length;
  const totalCount = dayTodos.length;
  const achievementRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Total timer time in seconds
  const totalTimerSeconds = dayTodos
    .filter((t) => t.type === 'timer')
    .reduce((acc, curr) => acc + curr.current_value, 0);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportError(null);
    try {
      // Small delay for DOM layout stability
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High-res
        skipAutoScale: true,
      });

      const link = document.createElement('a');
      link.download = `갓생살기_${selectedDate}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      console.error('Failed to export share card', err);
      setExportError('이미지 생성 중 문제가 발생했습니다. 화면 캡처 기능을 이용해 주세요.');
    } finally {
      setIsExporting(false);
    }
  };

  let parsedDate: Date;
  try {
    parsedDate = parseISO(selectedDate);
  } catch {
    parsedDate = new Date();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between text-white mb-3 px-2">
          <div className="flex items-center gap-1.5 text-sm font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            성취 공유 카드
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 9:16 Instagram Story Canvas Card */}
        <div
          ref={cardRef}
          className="w-full aspect-[9/16] rounded-3xl p-6 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 text-white shadow-2xl relative flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle background glow effects */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/30 rounded-full blur-3xl" />

          {/* Card Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                갓생살기 ✨
              </span>
              <span className="text-xs text-white/80 font-medium">
                {format(parsedDate, 'yyyy.MM.dd (E)', { locale: ko })}
              </span>
            </div>

            <div className="mt-8 text-center">
              <div className="text-5xl mb-2 animate-bounce">
                {currentLog?.mood_emoji || '🔥'}
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                {achievementRate === 100 ? '오늘의 완벽한 갓생! 🏆' : '오늘의 갓생 기록'}
              </h2>
              {currentLog?.one_line_diary ? (
                <p className="mt-2 text-xs text-white/90 bg-white/10 backdrop-blur-sm p-2.5 rounded-2xl font-medium leading-relaxed">
                  &ldquo;{currentLog.one_line_diary}&rdquo;
                </p>
              ) : (
                <p className="mt-2 text-xs text-white/70 italic">
                  &ldquo;작은 성취가 모여 위대한 변화를 만듭니다.&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Achievement Stats Box */}
          <div className="relative z-10 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">달성률</span>
              <span className="text-xl font-black text-amber-300">
                {achievementRate}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${achievementRate}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-center">
              <div className="bg-white/10 rounded-xl p-2">
                <span className="text-[10px] text-white/70 block">완료 목표</span>
                <span className="text-sm font-bold">
                  {completedCount} / {totalCount}개
                </span>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <span className="text-[10px] text-white/70 block">집중 시간</span>
                <span className="text-sm font-bold">
                  {totalTimerSeconds > 0 ? formatDurationKorean(totalTimerSeconds) : '0분'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer Branding */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-[11px] text-white/60">
            <span>#노멀크러시 #목표달성</span>
            <span>#갓생살기 #오늘도성공</span>
          </div>
        </div>

        {exportError && (
          <div className="w-full mt-2 p-2 rounded-xl bg-rose-500/80 text-white text-xs text-center flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{exportError}</span>
          </div>
        )}

        {/* Download & Share Actions */}
        <div className="w-full mt-3 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            {isExporting ? '이미지 생성 중...' : '스토리용 이미지 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};
