'use client';

import React from 'react';
import { X, Archive, Calendar, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';
import { useGoalStore } from '@/store/useGoalStore';

export const InboxDrawer: React.FC = () => {
  const { isInboxOpen, setIsInboxOpen, todos, selectedDate, moveFromInbox, deleteTodo, categories } = useGoalStore();

  if (!isInboxOpen) return null;

  const inboxTodos = todos.filter((t) => t.is_inbox);

  const getCategory = (catId?: string | null) => {
    return categories.find((c) => c.id === catId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">인박스 (보관함)</h3>
              <p className="text-xs text-slate-400">주의력 잔여물을 줄이기 위해 파킹해 둔 할 일</p>
            </div>
          </div>
          <button
            onClick={() => setIsInboxOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Inbox items */}
        <div className="flex-1 py-4 space-y-3">
          {inboxTodos.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-slate-200 mb-2 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-600">보관함이 비어있습니다</p>
              <p className="text-xs text-slate-400 mt-1">
                당장 하지 않아도 될 미완성 과제를 인박스에 넣어 뇌의 인지 부하를 줄여보세요.
              </p>
            </div>
          ) : (
            inboxTodos.map((todo) => {
              const cat = getCategory(todo.category_id);
              return (
                <div
                  key={todo.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-2 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    {cat && (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${cat.color_code}18`, color: cat.color_code }}
                      >
                        {cat.name}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`'${todo.title}' 목표를 삭제하시겠습니까?`)) {
                          deleteTodo(todo.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                      title="삭제"
                      aria-label="삭제"
                    >
                      <Trash2 className="w-[18px] h-[18px]" />
                    </button>
                  </div>

                  <p className="text-sm font-medium text-slate-800">{todo.title}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
                    <span className="text-xs text-slate-400">
                      {todo.type === 'binary' ? '단순 체크' : `${todo.target_value}${todo.unit || '회'}`}
                    </span>
                    <button
                      onClick={() => moveFromInbox(todo.id, selectedDate)}
                      className="text-xs font-bold text-violet-600 hover:text-violet-700 bg-white border border-violet-200 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      선택한 날짜로 이동
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
