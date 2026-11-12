'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Heart, ShieldCheck, Trash2, RotateCcw } from 'lucide-react';
import { useGoalStore } from '@/store/useGoalStore';

export const DailyMoodLog: React.FC = () => {
  const { selectedDate, dailyLogs, saveDailyLog, deleteDailyLog } = useGoalStore();

  const currentLog = dailyLogs[selectedDate];

  const moodEmojis = [
    { emoji: '🔥', label: '갓생' },
    { emoji: '✨', label: '뿌듯' },
    { emoji: '😊', label: '평온' },
    { emoji: '🍕', label: '소확행' },
    { emoji: '💤', label: '방전' },
    { emoji: '🌧️', label: '우울' },
  ];

  const [selectedEmoji, setSelectedEmoji] = useState(currentLog?.mood_emoji || '✨');
  const [diaryText, setDiaryText] = useState(currentLog?.one_line_diary || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSelectedEmoji(currentLog?.mood_emoji || '✨');
    setDiaryText(currentLog?.one_line_diary || '');
    setIsSaved(false);
  }, [selectedDate, currentLog]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyLog(selectedDate, selectedEmoji, diaryText, 'private');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`${selectedDate}의 기분 및 한줄 일기 기록을 삭제하시겠습니까?`)) {
      deleteDailyLog(selectedDate);
      setSelectedEmoji('✨');
      setDiaryText('');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{selectedDate}의 기분 & 한줄 기록</h3>
            <p className="text-xs text-slate-400">오늘 하루를 기억할 감정과 소소한 일상을 남겨보세요.</p>
          </div>
        </div>

        {currentLog && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="기록 삭제"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">삭제</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Mood Emojis Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">오늘의 기분 이모지</label>
          <div className="grid grid-cols-6 gap-2">
            {moodEmojis.map((m) => (
              <button
                type="button"
                key={m.label}
                onClick={() => setSelectedEmoji(m.emoji)}
                className={`
                  h-14 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all duration-150
                  ${selectedEmoji === m.emoji 
                    ? 'border-rose-400 bg-rose-50/60 shadow-sm scale-105 font-bold text-rose-700 ring-2 ring-rose-400/30' 
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600'}
                `}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-[10px] font-medium leading-none">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* One Line Diary with char count */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-600">한줄 일기 (노멀 크러시)</label>
            <span className="text-[10px] text-slate-400">{diaryText.length} / 150자</span>
          </div>
          <textarea
            rows={3}
            maxLength={150}
            placeholder="오늘 하루 있었던 작지만 소중한 순간이나 감정을 적어보세요..."
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 resize-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Bottom controls: Save */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400 font-medium">
            🔒 나만 볼 수 있는 안전한 개인 일기입니다
          </span>

          <button
            type="submit"
            className={`
              px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm
              ${isSaved 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'}
            `}
          >
            {isSaved ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                저장 완료!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                일기 저장
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
