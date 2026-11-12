'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Hash, Timer as TimerIcon, Calendar, Archive, Repeat, AlertCircle } from 'lucide-react';
import { useGoalStore } from '@/store/useGoalStore';
import { TodoType } from '@/types/database';

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({ isOpen, onClose }) => {
  const { selectedDate, categories, addTodo } = useGoalStore();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [type, setType] = useState<TodoType>('binary');
  const [targetValue, setTargetValue] = useState(10);
  const [timerMinutes, setTimerMinutes] = useState(25); // 25분 뽀모도로 기본값
  const [unit, setUnit] = useState('회');
  const [dueDate, setDueDate] = useState(selectedDate);
  const [dueTime, setDueTime] = useState('');
  const [isInbox, setIsInbox] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState<'daily' | 'weekday' | 'weekly'>('daily');
  const [errorMessage, setErrorMessage] = useState('');

  // Sync with selectedDate when modal opens
  useEffect(() => {
    if (isOpen) {
      setDueDate(selectedDate);
      setErrorMessage('');
      setCategoryId(categories[0]?.id || '');
    }
  }, [isOpen, selectedDate, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('목표 또는 할 일 제목을 입력해 주세요.');
      return;
    }

    let finalTarget = 1;
    let finalUnit = '회';

    if (type === 'numeric') {
      finalTarget = Math.max(1, Number(targetValue));
      finalUnit = unit.trim() || '회';
    } else if (type === 'timer') {
      finalTarget = Math.max(1, Number(timerMinutes) * 60);
      finalUnit = '초';
    }

    addTodo({
      category_id: categoryId || undefined,
      title: title.trim(),
      type,
      target_value: finalTarget,
      current_value: 0,
      unit: finalUnit,
      due_date: isInbox ? selectedDate : dueDate,
      due_time: dueTime || undefined,
      is_completed: false,
      is_inbox: isInbox,
      is_recurring: isRecurring,
      repeat_type: isRecurring ? repeatType : 'none',
      privacy_level: 'public',
    });

    setTitle('');
    setDueTime('');
    setIsInbox(false);
    setIsRecurring(false);
    setRepeatType('daily');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">새 목표 & 일정 추가</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isInbox ? '보관함(인박스)에 저장되어 주의력 분산을 방지합니다' : `${dueDate} 일정으로 등록`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Depth 1: Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">할 일 / 목표 내용 *</label>
            <input
              type="text"
              autoFocus
              placeholder="예: 영어 단어 30개 외우기, 헬스장 가기"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>

          {/* Depth 1: Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">카테고리</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`
                    px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border
                    ${categoryId === cat.id 
                      ? 'border-transparent text-white shadow-sm scale-105' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'}
                  `}
                  style={{
                    backgroundColor: categoryId === cat.id ? cat.color_code : undefined,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Depth 2: Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">목표 유형 (트래킹 방식)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setType('binary'); setUnit('회'); }}
                className={`p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  type === 'binary' ? 'border-violet-500 bg-violet-50/50 text-violet-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                단순 체크
              </button>

              <button
                type="button"
                onClick={() => { setType('numeric'); setUnit('회'); setTargetValue(30); }}
                className={`p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  type === 'numeric' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Hash className="w-4 h-4" />
                수치 목표
              </button>

              <button
                type="button"
                onClick={() => { setType('timer'); setTimerMinutes(25); }}
                className={`p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                  type === 'timer' ? 'border-rose-500 bg-rose-50/50 text-rose-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TimerIcon className="w-4 h-4" />
                타이머 측정
              </button>
            </div>
          </div>

          {/* Target Value Input (Conditional) */}
          {type === 'numeric' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">목표 수치</label>
                <input
                  type="number"
                  min="1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">단위</label>
                <input
                  type="text"
                  placeholder="예: 회, 분, 페이지, km"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
                />
              </div>
            </div>
          )}

          {type === 'timer' && (
            <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">목표 시간 설정 (분)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(1, Number(e.target.value)))}
                    className="w-16 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-center"
                  />
                  <span className="text-xs font-semibold text-slate-500">분</span>
                </div>
              </div>

              {/* Quick Presets (15, 25 뽀모도로, 30, 45, 60분) */}
              <div className="flex gap-1.5 flex-wrap">
                {[15, 25, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimerMinutes(mins)}
                    className={`flex-1 min-w-[45px] py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      timerMinutes === mins ? 'bg-rose-500 text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {mins}분{mins === 25 ? ' 🍅' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date & Time Picker */}
          {!isInbox && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">실행 날짜</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">실행 시간 (선택)</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* Depth 3: Inbox Toggle (Zeigarnik Effect Reduction) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/50">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">인박스(보관함)에 담기</span>
                <span className="text-[11px] text-amber-700">날짜를 정하지 않고 주의력 분산을 방지합니다.</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isInbox}
              onChange={(e) => setIsInbox(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          {/* Recurring Option */}
          <div className="space-y-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-xs font-bold text-slate-700">반복 루틴 등록</span>
              </div>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>
            {isRecurring && (
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                {[
                  { id: 'daily', label: '매일' },
                  { id: 'weekday', label: '평일(월~금)' },
                  { id: 'weekly', label: '매주 같은 요일' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRepeatType(item.id as 'daily' | 'weekday' | 'weekly')}
                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      repeatType === item.id
                        ? 'bg-violet-600 text-white border-transparent shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-200 transition-all flex items-center justify-center gap-2"
          >
            {isInbox ? '보관함에 저장' : '일정에 등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
};
