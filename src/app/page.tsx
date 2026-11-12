'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Archive, 
  Share2, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Heart, 
  Sparkles, 
  Flame,
  Filter,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { useGoalStore } from '@/store/useGoalStore';
import { App } from '@capacitor/app';
import { CalendarView } from '@/components/calendar/CalendarView';
import { TodoItem } from '@/components/todos/TodoItem';
import { CreateTodoModal } from '@/components/todos/CreateTodoModal';
import { InboxDrawer } from '@/components/todos/InboxDrawer';
import { DailyMoodLog } from '@/components/diary/DailyMoodLog';
import { ShareCardModal } from '@/components/share/ShareCardModal';
import { AdBanner } from '@/components/ads/AdBanner';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function Home() {
  const { 
    selectedDate, 
    setSelectedDate,
    activeTab, 
    setActiveTab, 
    isInboxOpen,
    setIsInboxOpen, 
    isShareModalOpen,
    setIsShareModalOpen, 
    todos, 
    categories,
    syncActiveTimer,
    ensureRecurringTodosForDate,
    exportBackupData,
    importBackupData
  } = useGoalStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Android Hardware Back Button Handling & Background Sync
  useEffect(() => {
    setIsMounted(true);
    
    // 초기 로딩 시 타이머 즉시 동기화 및 오늘자 반복 투두 확인
    syncActiveTimer();
    ensureRecurringTodosForDate(selectedDate);

    // Visibility change (화면 켜짐/앱 복귀 시 타이머 갱신)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncActiveTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Capacitor Native Event Listeners
    let backButtonHandle: any = null;
    let appStateHandle: any = null;
    let lastBackPressTime = 0;

    const setupCapacitorListeners = async () => {
      try {
        // App State change (백그라운드 -> 포그라운드 전환 시)
        appStateHandle = await App.addListener('appStateChange', (state) => {
          if (state.isActive) {
            syncActiveTimer();
          }
        });

        // Android Hardware Back Button
        backButtonHandle = await App.addListener('backButton', () => {
          // 모달이 열려있는 경우 모달 닫기
          if (isCreateModalOpen) {
            setIsCreateModalOpen(false);
            return;
          }
          if (isShareModalOpen) {
            setIsShareModalOpen(false);
            return;
          }
          if (isInboxOpen) {
            setIsInboxOpen(false);
            return;
          }
          // 다이어리 탭이면 투두 탭으로 이동
          if (activeTab === 'diary') {
            setActiveTab('todos');
            return;
          }
          // 메인 화면에서는 2초 내 재클릭 시 앱 종료
          const now = Date.now();
          if (now - lastBackPressTime < 2000) {
            App.exitApp();
          } else {
            lastBackPressTime = now;
            showToast('한 번 더 누르면 앱이 종료됩니다.');
          }
        });
      } catch (e) {
        // 웹 브라우저 환경 등 Capacitor Native API 미지원 환경 무시
      }
    };

    setupCapacitorListeners();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (backButtonHandle && typeof backButtonHandle.remove === 'function') {
        backButtonHandle.remove();
      }
      if (appStateHandle && typeof appStateHandle.remove === 'function') {
        appStateHandle.remove();
      }
    };
  }, [
    isCreateModalOpen, 
    isShareModalOpen, 
    isInboxOpen, 
    activeTab, 
    selectedDate, 
    syncActiveTimer, 
    ensureRecurringTodosForDate, 
    setActiveTab, 
    setIsInboxOpen, 
    setIsShareModalOpen
  ]);

  const handleExportBackup = () => {
    try {
      const dataStr = exportBackupData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `goalmate-backup-${format(new Date(), 'yyyyMMdd-HHmm')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('데이터 백업 파일이 저장되었습니다.');
    } catch {
      showToast('백업 생성 실패');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importBackupData(content)) {
        showToast('성공적으로 데이터를 복원했습니다!');
      } else {
        showToast('백업 파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered todos for current selected date
  const dayTodos = todos.filter((t) => {
    if (t.is_inbox) return false;
    if (t.due_date !== selectedDate) return false;
    if (selectedCategoryFilter && t.category_id !== selectedCategoryFilter) return false;
    return true;
  });

  const inboxCount = todos.filter((t) => t.is_inbox).length;
  const completedCount = dayTodos.filter((t) => t.is_completed).length;
  const totalCount = dayTodos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let parsedDate: Date;
  try {
    parsedDate = parseISO(selectedDate);
  } catch {
    parsedDate = new Date();
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <img src="/icon.svg" alt="갓생살기 로고" className="w-11 h-11 rounded-2xl shadow-lg shadow-violet-200/80 animate-pulse object-cover" />
          <span className="text-xs font-bold text-slate-500">갓생살기 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="갓생살기 로고" className="w-9 h-9 rounded-2xl shadow-md shadow-violet-200/80 object-cover" />
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-800">
                갓생살기
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold block -mt-0.5">
                부담 없는 하루 목표 & 습관 트래커
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Today Jump Button */}
            {selectedDate !== format(new Date(), 'yyyy-MM-dd') && (
              <button
                onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
                title="오늘로 돌아가기"
              >
                <RotateCcw className="w-3.5 h-3.5 text-violet-600" />
                <span className="hidden sm:inline">오늘</span>
              </button>
            )}

            {/* Backup Export/Import */}
            <div className="flex items-center bg-slate-100 rounded-2xl p-0.5">
              <button
                onClick={handleExportBackup}
                className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 transition-all text-xs font-semibold"
                title="데이터 백업 파일 저장"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <label
                className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-800 transition-all text-xs font-semibold cursor-pointer"
                title="데이터 백업 파일 복원"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>

            {/* Inbox Button */}
            <button
              onClick={() => setIsInboxOpen(true)}
              className="relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-all flex items-center gap-1.5 text-xs font-bold active:scale-95 shadow-xs"
              title="인박스 보관함 열기"
            >
              <Archive className="w-4 h-4 text-amber-600 shrink-0" />
              <span>인박스</span>
              {inboxCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                  {inboxCount}
                </span>
              )}
            </button>

            {/* Share Card Trigger */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2.5 rounded-2xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">공유 카드</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Calendar Section */}
        <section>
          <CalendarView />
        </section>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('todos')}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5
                ${activeTab === 'todos' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              <CheckCircle2 className="w-4 h-4 text-violet-600" />
              일정 & 수치 목표
              <span className="text-[11px] opacity-60">({dayTodos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('diary')}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5
                ${activeTab === 'diary' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              기분 & 한줄 일기
            </button>
          </div>

          {activeTab === 'todos' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-200 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              목표 추가
            </button>
          )}
        </div>

        {/* Tab 1: Todos & Numeric Tracking */}
        {activeTab === 'todos' && (
          <div className="space-y-4">
            {/* Date Headline & Stats Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  {format(parsedDate, 'M월 d일 (E)', { locale: ko })}
                </h3>
              </div>

              {totalCount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    달성률 <strong className="text-violet-600">{completionRate}%</strong>
                  </span>
                  <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400">등록된 목표 없음</span>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className={`
                  px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0
                  ${!selectedCategoryFilter ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
                `}
              >
                전체
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === cat.id ? null : cat.id)}
                  className={`
                    px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 border
                    ${selectedCategoryFilter === cat.id ? 'text-white border-transparent shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
                  `}
                  style={{
                    backgroundColor: selectedCategoryFilter === cat.id ? cat.color_code : undefined,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Todo Items List */}
            <div className="space-y-2.5">
              {dayTodos.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-slate-100 shadow-sm">
                  <Flame className="w-10 h-10 text-violet-200 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">이 날짜에 등록된 목표가 없습니다</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    공부 타이머, 운동 횟수 등 오늘 달성할 소소한 목표를 추가해보세요!
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    새 목표 등록하기
                  </button>

                  {inboxCount > 0 && (
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Archive className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-amber-950">
                              인박스(보관함)에 목표가 {inboxCount}개 보관되어 있습니다!
                            </p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              보관함을 열어 오늘 날짜로 즉시 다시 꺼내오거나 수정할 수 있습니다.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsInboxOpen(true)}
                          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
                        >
                          <Archive className="w-4 h-4" />
                          <span>인박스 보관함 열기 ({inboxCount})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                dayTodos.map((todo) => {
                  const cat = categories.find((c) => c.id === todo.category_id);
                  return <TodoItem key={todo.id} todo={todo} category={cat} />;
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Mood Emoji & Diary */}
        {activeTab === 'diary' && (
          <section>
            <DailyMoodLog />
          </section>
        )}

        {/* Google AdMob Sponsored Banner Area */}
        <AdBanner />
      </div>

      {/* Modals & Drawers */}
      <CreateTodoModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      <InboxDrawer />
      <ShareCardModal />

      {/* Toast Notification (e.g. Android Back press notice / Backup) */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-800/90 text-white text-xs font-semibold shadow-lg backdrop-blur-sm animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}
    </main>
  );
}
