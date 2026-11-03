'use client';

import React, { useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Sparkles, CalendarDays } from 'lucide-react';
import { useGoalStore } from '@/store/useGoalStore';

export const CalendarView: React.FC = () => {
  const { selectedDate, setSelectedDate, viewingMonth, setViewingMonth, todos, dailyLogs } = useGoalStore();

  const currentMonthDate = useMemo(() => {
    try {
      return parseISO(viewingMonth || selectedDate);
    } catch {
      return new Date();
    }
  }, [viewingMonth, selectedDate]);

  const handlePrevMonth = () => {
    setViewingMonth(format(subMonths(currentMonthDate, 1), 'yyyy-MM-dd'));
  };

  const handleNextMonth = () => {
    setViewingMonth(format(addMonths(currentMonthDate, 1), 'yyyy-MM-dd'));
  };

  const handleTodayClick = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setSelectedDate(today);
    setViewingMonth(today);
  };

  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [calendarStart, calendarEnd]);

  // Pre-calculate stats per day
  const dayStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; rate: number; emoji?: string }> = {};
    
    // Group todos by due_date
    todos.forEach((todo) => {
      if (todo.is_inbox) return;
      const d = todo.due_date;
      if (!stats[d]) stats[d] = { total: 0, completed: 0, rate: 0 };
      stats[d].total += 1;
      if (todo.is_completed) stats[d].completed += 1;
    });

    Object.keys(stats).forEach((d) => {
      if (stats[d].total > 0) {
        stats[d].rate = Math.round((stats[d].completed / stats[d].total) * 100);
      }
    });

    // Attach mood emojis
    Object.keys(dailyLogs).forEach((d) => {
      if (dailyLogs[d]?.mood_emoji) {
        if (!stats[d]) stats[d] = { total: 0, completed: 0, rate: 0 };
        stats[d].emoji = dailyLogs[d].mood_emoji || undefined;
      }
    });

    return stats;
  }, [todos, dailyLogs]);

  const weekLabels = ['일', '월', '화', '수', '목', '금', '토'];

  const isViewingCurrentMonth = isSameMonth(new Date(), currentMonthDate);
  const isSelectedInViewingMonth = isSameMonth(parseISO(selectedDate), currentMonthDate);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            {format(currentMonthDate, 'yyyy년 M월', { locale: ko })}
          </h2>
          {(!isViewingCurrentMonth || !isSameDay(parseISO(selectedDate), new Date())) && (
            <button
              onClick={handleTodayClick}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors flex items-center gap-1 shadow-sm"
              title="오늘 날짜로 이동"
            >
              <Sparkles className="w-3 h-3 text-violet-500" />
              오늘로
            </button>
          )}
          {!isSelectedInViewingMonth && (
            <button
              onClick={() => setViewingMonth(selectedDate)}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
              title="선택된 날짜의 달로 이동"
            >
              <CalendarDays className="w-3 h-3" />
              선택일 보기
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="다음 달"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {weekLabels.map((w, idx) => (
          <span 
            key={w} 
            className={`text-xs font-semibold py-1 ${idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-blue-500' : 'text-slate-400'}`}
          >
            {w}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = dateStr === selectedDate;
          const isCurrentMonth = isSameMonth(day, currentMonthDate);
          const isDayToday = isToday(day);
          const stat = dayStats[dateStr] || { total: 0, completed: 0, rate: 0 };
          const hasTodos = stat.total > 0;
          const rate = stat.rate;

          // Fill styling based on completion rate
          let fillBg = 'bg-transparent';
          if (rate === 100) fillBg = 'bg-emerald-100/80 text-emerald-900';
          else if (rate >= 66) fillBg = 'bg-violet-100/80 text-violet-900';
          else if (rate >= 33) fillBg = 'bg-amber-100/80 text-amber-900';
          else if (rate > 0) fillBg = 'bg-slate-100 text-slate-700';

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`
                relative h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-between p-1.5 transition-all
                ${!isCurrentMonth ? 'opacity-25' : 'opacity-100'}
                ${isSelected ? 'ring-2 ring-violet-600 ring-offset-2 font-bold shadow-md z-10' : 'hover:bg-slate-50'}
                ${isSelected && fillBg === 'bg-transparent' ? 'bg-violet-50/70' : fillBg}
              `}
            >
              <div className="w-full flex items-center justify-between">
                <span
                  className={`
                    text-xs sm:text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full
                    ${isDayToday ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-700'}
                  `}
                >
                  {format(day, 'd')}
                </span>

                {stat.emoji && (
                  <span className="text-xs scale-90 sm:scale-100" title="오늘의 기분">
                    {stat.emoji}
                  </span>
                )}
              </div>

              {/* Achievement Visual Indicator (Heatmap bar / dots) */}
              <div className="w-full flex items-center justify-center mt-auto pb-0.5">
                {hasTodos ? (
                  <div className="w-full px-1">
                    <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          rate === 100 ? 'bg-emerald-500' : rate >= 50 ? 'bg-violet-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-transparent" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
