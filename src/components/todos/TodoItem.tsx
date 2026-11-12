'use client';

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  Lock, 
  Users, 
  Globe, 
  Trash2, 
  Archive,
  Clock,
  Edit2,
  X,
  Save
} from 'lucide-react';
import { Todo, GoalCategory, PrivacyLevel } from '@/types/database';
import { useGoalStore } from '@/store/useGoalStore';
import { formatSecondsToTime } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface TodoItemProps {
  todo: Todo;
  category?: GoalCategory;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, category }) => {
  const { 
    toggleTodoComplete, 
    updateNumericValue, 
    setNumericValue,
    startTimer,
    pauseTimer,
    resetTimer,
    syncActiveTimer,
    activeTimer,
    deleteTodo, 
    moveToInbox,
    updateTodo,
    categories
  } = useGoalStore();

  const isTimerRunning = activeTimer?.todoId === todo.id;

  // Realtime timer sync every 500ms when this todo is running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        syncActiveTimer();
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, syncActiveTimer]);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editTarget, setEditTarget] = useState(todo.target_value);
  const [editUnit, setEditUnit] = useState(todo.unit || '회');
  const [editTime, setEditTime] = useState(todo.due_time || '');
  const [editCategoryId, setEditCategoryId] = useState(todo.category_id || '');
  const [editPrivacy, setEditPrivacy] = useState<PrivacyLevel>(todo.privacy_level);

  // Direct numeric value editing
  const [isEditingCurrentVal, setIsEditingCurrentVal] = useState(false);
  const [directValInput, setDirectValInput] = useState(String(todo.current_value));

  const handleToggleComplete = () => {
    if (!todo.is_completed) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8B5CF6', '#10B981', '#F59E0B']
      });
    }
    // If timer is running, pause it when completing
    if (isTimerRunning) {
      pauseTimer(todo.id);
    }
    toggleTodoComplete(todo.id);
  };

  const handleNumericStep = (delta: number) => {
    const nextVal = todo.current_value + delta;
    if (nextVal >= todo.target_value && !todo.is_completed) {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#10B981', '#8B5CF6']
      });
    }
    updateNumericValue(todo.id, delta);
  };

  const handleDirectValSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(directValInput, 10);
    if (!isNaN(parsed)) {
      setNumericValue(todo.id, parsed);
    }
    setIsEditingCurrentVal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    updateTodo(todo.id, {
      title: editTitle.trim(),
      target_value: Math.max(1, Number(editTarget)),
      unit: editUnit,
      due_time: editTime || null,
      category_id: editCategoryId || null,
      privacy_level: editPrivacy,
    });
    setIsEditing(false);
  };

  const categoryColor = category?.color_code || '#8B5CF6';

  const handleTogglePrivacy = () => {
    const nextPrivacy: Record<PrivacyLevel, PrivacyLevel> = {
      public: 'friends',
      friends: 'private',
      private: 'public',
    };
    const newLevel = nextPrivacy[todo.privacy_level] || 'public';
    updateTodo(todo.id, { privacy_level: newLevel });
  };

  const getPrivacyIcon = () => {
    switch (todo.privacy_level) {
      case 'private':
        return (
          <button
            type="button"
            onClick={handleTogglePrivacy}
            className="p-2 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50 active:bg-amber-100 transition-colors"
            title="공개 범위: 나만보기 (클릭하여 변경)"
            aria-label="공개 범위: 나만보기 (클릭하여 변경)"
          >
            <Lock className="w-[18px] h-[18px]" />
          </button>
        );
      case 'friends':
        return (
          <button
            type="button"
            onClick={handleTogglePrivacy}
            className="p-2 rounded-xl text-violet-600 hover:text-violet-700 hover:bg-violet-50 active:bg-violet-100 transition-colors"
            title="공개 범위: 친구공개 (클릭하여 변경)"
            aria-label="공개 범위: 친구공개 (클릭하여 변경)"
          >
            <Users className="w-[18px] h-[18px]" />
          </button>
        );
      default:
        return (
          <button
            type="button"
            onClick={handleTogglePrivacy}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
            title="공개 범위: 전체공개 (클릭하여 변경)"
            aria-label="공개 범위: 전체공개 (클릭하여 변경)"
          >
            <Globe className="w-[18px] h-[18px]" />
          </button>
        );
    }
  };

  // Inline Edit View
  if (isEditing) {
    return (
      <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl p-4 border-2 border-violet-500 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700">목표 내용 수정</span>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">제목</label>
          <input
            type="text"
            required
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {todo.type === 'numeric' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">목표 수치</label>
              <input
                type="number"
                min="1"
                value={editTarget}
                onChange={(e) => setEditTarget(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">단위</label>
              <input
                type="text"
                value={editUnit}
                onChange={(e) => setEditUnit(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
          </div>
        )}

        {todo.type === 'timer' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">목표 집중 시간 (분)</label>
            <input
              type="number"
              min="1"
              value={Math.round(editTarget / 60)}
              onChange={(e) => setEditTarget(Number(e.target.value) * 60)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">카테고리</label>
            <select
              value={editCategoryId}
              onChange={(e) => setEditCategoryId(e.target.value)}
              className="w-full px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
            >
              <option value="">없음</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">공개 범위</label>
            <select
              value={editPrivacy}
              onChange={(e) => setEditPrivacy(e.target.value as PrivacyLevel)}
              className="w-full px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
            >
              <option value="public">전체공개</option>
              <option value="friends">친구공개</option>
              <option value="private">나만보기</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 flex items-center gap-1 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            저장
          </button>
        </div>
      </form>
    );
  }

  return (
    <div 
      className={`
        group relative bg-white rounded-2xl p-4 border transition-all duration-200
        ${todo.is_completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Left Action: Universal Checkbox for ALL Todo Types */}
        <button
          onClick={handleToggleComplete}
          className={`
            mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0
            ${todo.is_completed 
              ? 'bg-emerald-500 text-white shadow-sm scale-105' 
              : 'border-2 border-slate-300 hover:border-emerald-500 bg-white'}
          `}
          aria-label={todo.is_completed ? '완료 취소' : '완료하기'}
          title={todo.is_completed ? '완료 취소' : '수동 완료 처리'}
        >
          {todo.is_completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Center Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {category && (
              <span 
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                style={{ backgroundColor: `${categoryColor}18`, color: categoryColor }}
              >
                {category.name}
              </span>
            )}

            {todo.due_time && (
              <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {todo.due_time}
              </span>
            )}

            <div className="ml-auto flex items-center gap-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
              {getPrivacyIcon()}
              
              {/* Edit button */}
              <button
                type="button"
                onClick={() => {
                  setEditTitle(todo.title);
                  setEditTarget(todo.target_value);
                  setEditUnit(todo.unit || '회');
                  setEditTime(todo.due_time || '');
                  setEditCategoryId(todo.category_id || '');
                  setEditPrivacy(todo.privacy_level);
                  setIsEditing(true);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 active:bg-violet-100 transition-colors"
                title="목표 수정"
                aria-label="목표 수정"
              >
                <Edit2 className="w-[18px] h-[18px]" />
              </button>

              {/* Move to Inbox button */}
              <button
                type="button"
                onClick={() => {
                  const ok = window.confirm(
                    `'${todo.title}' 목표를 인박스(보관함)로 이동하시겠습니까?\n\n※ 오늘 목표 목록에서 숨겨지며, 상단 [인박스] 메뉴에서 언제든 다시 꺼내오거나 수정할 수 있습니다.`
                  );
                  if (ok) {
                    moveToInbox(todo.id);
                  }
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 active:bg-amber-100 transition-colors"
                title="인박스로 보관 (날짜 미지정 보관함으로 이동)"
                aria-label="인박스로 보관"
              >
                <Archive className="w-[18px] h-[18px]" />
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`'${todo.title}' 목표를 삭제하시겠습니까?`)) {
                    deleteTodo(todo.id);
                  }
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                title="목표 삭제"
                aria-label="목표 삭제"
              >
                <Trash2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          <h3 
            className={`
              text-sm font-medium leading-snug transition-all
              ${todo.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}
            `}
          >
            {todo.title}
          </h3>

          {/* Numeric Tracker Progress & Quick Steppers */}
          {todo.type === 'numeric' && (
            <div className="mt-2.5 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>진행률</span>
                  <div className="flex items-center gap-1">
                    {isEditingCurrentVal ? (
                      <form onSubmit={handleDirectValSubmit} className="flex items-center gap-1">
                        <input
                          type="number"
                          autoFocus
                          value={directValInput}
                          onChange={(e) => setDirectValInput(e.target.value)}
                          onBlur={handleDirectValSubmit}
                          className="w-14 px-1 py-0.5 rounded text-xs border border-violet-500 font-bold text-center"
                        />
                        <button type="submit" className="text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded">확인</button>
                      </form>
                    ) : (
                      <button
                        onClick={() => {
                          setDirectValInput(String(todo.current_value));
                          setIsEditingCurrentVal(true);
                        }}
                        className="hover:underline cursor-pointer"
                        title="숫자를 직접 입력하려면 클릭하세요"
                      >
                        <strong className="text-violet-600">{todo.current_value}</strong>
                      </button>
                    )}
                    <span>/ {todo.target_value} {todo.unit || '회'}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${
                      todo.is_completed ? 'bg-emerald-500' : 'bg-violet-500'
                    }`}
                    style={{ width: `${Math.min(100, (todo.current_value / todo.target_value) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleNumericStep(-1)}
                  disabled={todo.current_value <= 0}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center font-bold"
                  aria-label="1 감소"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleNumericStep(1)}
                  className="w-7 h-7 rounded-lg bg-violet-600 text-white hover:bg-violet-700 flex items-center justify-center font-bold shadow-sm"
                  aria-label="1 증가"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleNumericStep(5)}
                  className="px-1.5 h-7 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 flex items-center justify-center text-xs font-bold"
                  title="5 증가"
                >
                  +5
                </button>
              </div>
            </div>
          )}

          {/* Timer Stopwatch View */}
          {todo.type === 'timer' && (
            <div className="mt-2.5 flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    {isTimerRunning ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-rose-600 font-bold">측정 중</span>
                      </>
                    ) : (
                      <span>스톱워치</span>
                    )}
                  </span>
                  <span>
                    <strong className="text-violet-600">{formatSecondsToTime(todo.current_value)}</strong>
                    <span className="text-slate-400 font-normal"> / {formatSecondsToTime(todo.target_value)}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${
                      todo.is_completed ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (todo.current_value / todo.target_value) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Play / Pause button */}
                <button
                  onClick={() => {
                    if (isTimerRunning) {
                      pauseTimer(todo.id);
                    } else {
                      startTimer(todo.id);
                    }
                  }}
                  className={`
                    w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 shadow-sm
                    ${isTimerRunning 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-violet-600 text-white hover:bg-violet-700'}
                  `}
                  title={isTimerRunning ? '일시 정지' : '타이머 시작'}
                  aria-label={isTimerRunning ? '일시 정지' : '타이머 시작'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                {/* Reset button */}
                <button
                  onClick={() => resetTimer(todo.id)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                  title="타이머 리셋"
                  aria-label="타이머 리셋"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
