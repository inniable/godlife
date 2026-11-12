'use client';

import React, { useState } from 'react';
import { X, Archive, Calendar, ArrowRight, Trash2, CheckCircle2, Edit2, Save, Undo2 } from 'lucide-react';
import { useGoalStore } from '@/store/useGoalStore';

export const InboxDrawer: React.FC = () => {
  const { isInboxOpen, setIsInboxOpen, todos, selectedDate, moveFromInbox, deleteTodo, updateTodo, categories } = useGoalStore();

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTarget, setEditTarget] = useState(1);
  const [editUnit, setEditUnit] = useState('회');

  if (!isInboxOpen) return null;

  const inboxTodos = todos.filter((t) => t.is_inbox);

  const getCategory = (catId?: string | null) => {
    return categories.find((c) => c.id === catId);
  };

  const startEdit = (todo: any) => {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
    setEditTarget(todo.target_value);
    setEditUnit(todo.unit || '회');
  };

  const handleSaveEdit = (e: React.FormEvent, todoId: string) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateTodo(todoId, {
      title: editTitle.trim(),
      target_value: Math.max(1, Number(editTarget)),
      unit: editUnit,
    });
    setEditingTodoId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">인박스 (보관함)</h3>
              <p className="text-xs text-slate-400">날짜 없이 임시 보관해 둔 목표들</p>
            </div>
          </div>
          <button
            onClick={() => setIsInboxOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            title="닫기 (뒤로가기)"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="my-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
          💡 <strong>[날짜로 꺼내기]</strong>를 누르면 오늘({selectedDate}) 화면으로 즉시 돌아가며 목표 목록에 다시 표시됩니다.
        </div>

        {/* List of Inbox items */}
        <div className="flex-1 py-2 space-y-3">
          {inboxTodos.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-slate-200 mb-2 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-600">보관함이 비어있습니다</p>
              <p className="text-xs text-slate-400 mt-1">
                당장 오늘 하지 않아도 될 목표를 인박스에 보관하여 주의력 분산을 방지할 수 있습니다.
              </p>
            </div>
          ) : (
            inboxTodos.map((todo) => {
              const cat = getCategory(todo.category_id);
              const isEditing = editingTodoId === todo.id;

              if (isEditing) {
                return (
                  <form
                    key={todo.id}
                    onSubmit={(e) => handleSaveEdit(e, todo.id)}
                    className="bg-white border-2 border-violet-500 rounded-2xl p-4 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">목표 수정</span>
                      <button
                        type="button"
                        onClick={() => setEditingTodoId(null)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                    {todo.type === 'numeric' && (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          value={editTarget}
                          onChange={(e) => setEditTarget(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                        <input
                          type="text"
                          value={editUnit}
                          onChange={(e) => setEditUnit(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                    )}
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingTodoId(null)}
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
                  key={todo.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-2.5 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    {cat ? (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${cat.color_code}18`, color: cat.color_code }}
                      >
                        {cat.name}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">카테고리 없음</span>
                    )}

                    <div className="flex items-center gap-1">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => startEdit(todo)}
                        className="p-2 rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 active:bg-violet-100 transition-colors"
                        title="내용 수정"
                        aria-label="내용 수정"
                      >
                        <Edit2 className="w-[18px] h-[18px]" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`'${todo.title}' 목표를 영구 삭제하시겠습니까?`)) {
                            deleteTodo(todo.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                        title="삭제"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">{todo.title}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
                    <span className="text-xs text-slate-400">
                      {todo.type === 'binary' ? '체크형' : `${todo.target_value}${todo.unit || '회'}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        moveFromInbox(todo.id, selectedDate);
                        setIsInboxOpen(false);
                      }}
                      className="text-xs font-bold text-violet-700 hover:text-violet-800 bg-white hover:bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      title="오늘 날짜로 가져오고 인박스를 닫습니다"
                    >
                      <Calendar className="w-3.5 h-3.5 text-violet-600" />
                      <span>오늘({selectedDate})로 꺼내기</span>
                      <ArrowRight className="w-3 h-3 text-violet-400" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Close Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsInboxOpen(false)}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Undo2 className="w-4 h-4" />
            <span>닫기 (목록 화면으로 돌아가기)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
