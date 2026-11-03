import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format, parseISO, getDay } from 'date-fns';
import { Todo, GoalCategory, DailyLog, PrivacyLevel, TodoType } from '@/types/database';

interface ActiveTimer {
  todoId: string;
  startedAt: number; // timestamp in ms
  baseValue: number; // seconds accumulated before this start
}

interface GoalState {
  selectedDate: string;
  viewingMonth: string; // YYYY-MM for calendar navigation without changing selectedDate
  activeTab: 'todos' | 'diary';
  isInboxOpen: boolean;
  isShareModalOpen: boolean;
  categories: GoalCategory[];
  todos: Todo[];
  dailyLogs: Record<string, DailyLog>; // key: YYYY-MM-DD
  activeTimer: ActiveTimer | null;

  setSelectedDate: (date: string) => void;
  setViewingMonth: (monthStr: string) => void;
  setActiveTab: (tab: 'todos' | 'diary') => void;
  setIsInboxOpen: (open: boolean) => void;
  setIsShareModalOpen: (open: boolean) => void;

  toggleTodoComplete: (id: string) => void;
  updateNumericValue: (id: string, delta: number) => void;
  setNumericValue: (id: string, value: number) => void;
  
  // Timer actions with timestamp precision
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  syncActiveTimer: () => void;

  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => void;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'user_id' | 'created_at'>>) => void;
  deleteTodo: (id: string) => void;
  moveToInbox: (id: string) => void;
  moveFromInbox: (id: string, dueDate: string) => void;

  // Recurring & Backup actions
  ensureRecurringTodosForDate: (targetDate: string) => void;
  exportBackupData: () => string;
  importBackupData: (jsonData: string) => boolean;

  saveDailyLog: (date: string, moodEmoji: string, diary: string, privacy?: PrivacyLevel) => void;
  deleteDailyLog: (date: string) => void;

  addCategory: (name: string, colorCode: string) => void;
  deleteCategory: (id: string) => void;
}

const defaultCategories: GoalCategory[] = [
  { id: 'cat-study', user_id: 'user-demo', name: '공부/업무', color_code: '#8B5CF6', created_at: new Date().toISOString() },
  { id: 'cat-workout', user_id: 'user-demo', name: '운동/건강', color_code: '#10B981', created_at: new Date().toISOString() },
  { id: 'cat-routine', user_id: 'user-demo', name: '습관/루틴', color_code: '#F59E0B', created_at: new Date().toISOString() },
];

const todayStr = format(new Date(), 'yyyy-MM-dd');

const initialTodos: Todo[] = [];

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      selectedDate: todayStr,
      viewingMonth: todayStr,
      activeTab: 'todos',
      isInboxOpen: false,
      isShareModalOpen: false,
      categories: defaultCategories,
      todos: initialTodos,
      dailyLogs: {},
      activeTimer: null,

      setSelectedDate: (date) => {
        set({ selectedDate: date, viewingMonth: date });
        get().ensureRecurringTodosForDate(date);
      },
      setViewingMonth: (monthStr) => set({ viewingMonth: monthStr }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsInboxOpen: (open) => set({ isInboxOpen: open }),
      setIsShareModalOpen: (open) => set({ isShareModalOpen: open }),

      ensureRecurringTodosForDate: (targetDate: string) => {
        const { todos } = get();
        const existingTitles = new Set(
          todos.filter((t) => !t.is_inbox && t.due_date === targetDate).map((t) => t.title)
        );

        let parsed: Date;
        try {
          parsed = parseISO(targetDate);
        } catch {
          parsed = new Date();
        }
        const dayOfWeek = getDay(parsed); // 0=Sun, 1-5=Mon-Fri, 6=Sat

        const recurringTemplates = new Map<string, Todo>();
        todos.forEach((t) => {
          if (t.is_recurring && t.title) {
            if (!recurringTemplates.has(t.title)) {
              recurringTemplates.set(t.title, t);
            }
          }
        });

        const newTodos: Todo[] = [];
        recurringTemplates.forEach((template, title) => {
          if (existingTitles.has(title)) return;
          
          const repeatType = template.repeat_type || 'daily';
          let shouldCreate = false;
          if (repeatType === 'daily') {
            shouldCreate = true;
          } else if (repeatType === 'weekday') {
            shouldCreate = dayOfWeek >= 1 && dayOfWeek <= 5;
          } else if (repeatType === 'weekly') {
            let templateDay = 0;
            try {
              templateDay = getDay(parseISO(template.due_date));
            } catch {
              templateDay = 0;
            }
            shouldCreate = dayOfWeek === templateDay;
          }

          if (shouldCreate) {
            newTodos.push({
              ...template,
              id: 'todo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
              due_date: targetDate,
              current_value: 0,
              is_completed: false,
              is_inbox: false,
              created_at: new Date().toISOString(),
            });
          }
        });

        if (newTodos.length > 0) {
          set((state) => ({ todos: [...state.todos, ...newTodos] }));
        }
      },

      exportBackupData: () => {
        const state = get();
        const backup = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          todos: state.todos,
          categories: state.categories,
          dailyLogs: state.dailyLogs,
        };
        return JSON.stringify(backup, null, 2);
      },

      importBackupData: (jsonData: string) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (parsed && Array.isArray(parsed.todos)) {
            set({
              todos: parsed.todos,
              categories: parsed.categories || get().categories,
              dailyLogs: parsed.dailyLogs || get().dailyLogs,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      toggleTodoComplete: (id) =>
        set((state) => {
          return {
            todos: state.todos.map((t) => {
              if (t.id !== id) return t;
              const nextCompleted = !t.is_completed;
              // If completing, set current to target if it wasn't reached yet; if un-completing, keep value
              return {
                ...t,
                is_completed: nextCompleted,
                current_value: nextCompleted 
                  ? Math.max(t.current_value, t.target_value) 
                  : t.current_value,
              };
            }),
          };
        }),

      updateNumericValue: (id, delta) =>
        set((state) => ({
          todos: state.todos.map((t) => {
            if (t.id !== id) return t;
            const nextVal = Math.max(0, t.current_value + delta);
            const isCompleted = nextVal >= t.target_value;
            return {
              ...t,
              current_value: nextVal,
              is_completed: isCompleted,
            };
          }),
        })),

      setNumericValue: (id, value) =>
        set((state) => ({
          todos: state.todos.map((t) => {
            if (t.id !== id) return t;
            const nextVal = Math.max(0, value);
            return {
              ...t,
              current_value: nextVal,
              is_completed: nextVal >= t.target_value,
            };
          }),
        })),

      // Timer Actions with Date.now() timestamp accuracy
      startTimer: (id) => {
        const { todos, activeTimer } = get();
        // If another timer was running, pause it first
        if (activeTimer && activeTimer.todoId !== id) {
          get().pauseTimer(activeTimer.todoId);
        }
        const targetTodo = todos.find((t) => t.id === id);
        if (!targetTodo) return;

        set({
          activeTimer: {
            todoId: id,
            startedAt: Date.now(),
            baseValue: targetTodo.current_value,
          },
        });
      },

      pauseTimer: (id) => {
        const { activeTimer, todos } = get();
        if (!activeTimer || activeTimer.todoId !== id) return;

        const elapsedSecs = Math.floor((Date.now() - activeTimer.startedAt) / 1000);
        const finalVal = activeTimer.baseValue + elapsedSecs;

        set({
          activeTimer: null,
          todos: todos.map((t) => {
            if (t.id !== id) return t;
            return {
              ...t,
              current_value: finalVal,
              is_completed: finalVal >= t.target_value,
            };
          }),
        });
      },

      resetTimer: (id) => {
        const { activeTimer, todos } = get();
        if (activeTimer && activeTimer.todoId === id) {
          set({ activeTimer: null });
        }
        set({
          todos: todos.map((t) => (t.id === id ? { ...t, current_value: 0, is_completed: false } : t)),
        });
      },

      syncActiveTimer: () => {
        const { activeTimer, todos } = get();
        if (!activeTimer) return;

        const elapsedSecs = Math.floor((Date.now() - activeTimer.startedAt) / 1000);
        const currentTotal = activeTimer.baseValue + elapsedSecs;

        set({
          todos: todos.map((t) => {
            if (t.id !== activeTimer.todoId) return t;
            return {
              ...t,
              current_value: currentTotal,
              is_completed: currentTotal >= t.target_value,
            };
          }),
        });
      },

      addTodo: (newTodoData) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...newTodoData,
              id: 'todo-' + Date.now(),
              user_id: 'user-demo',
              created_at: new Date().toISOString(),
            },
          ],
        })),

      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((t) => {
            if (t.id !== id) return t;
            const updated = { ...t, ...updates };
            // re-evaluate completion if target_value changed
            if (updates.target_value !== undefined || updates.current_value !== undefined) {
              updated.is_completed = updated.current_value >= updated.target_value;
            }
            return updated;
          }),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
          activeTimer: state.activeTimer?.todoId === id ? null : state.activeTimer,
        })),

      moveToInbox: (id) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, is_inbox: true } : t)),
          activeTimer: state.activeTimer?.todoId === id ? null : state.activeTimer,
        })),

      moveFromInbox: (id, dueDate) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, is_inbox: false, due_date: dueDate } : t)),
        })),

      saveDailyLog: (date, moodEmoji, diary, privacy = 'public') =>
        set((state) => ({
          dailyLogs: {
            ...state.dailyLogs,
            [date]: {
              id: state.dailyLogs[date]?.id || 'log-' + Date.now(),
              user_id: 'user-demo',
              log_date: date,
              mood_emoji: moodEmoji,
              one_line_diary: diary,
              privacy_level: privacy,
              created_at: state.dailyLogs[date]?.created_at || new Date().toISOString(),
            },
          },
        })),

      deleteDailyLog: (date) =>
        set((state) => {
          const nextLogs = { ...state.dailyLogs };
          delete nextLogs[date];
          return { dailyLogs: nextLogs };
        }),

      addCategory: (name, colorCode) =>
        set((state) => ({
          categories: [
            ...state.categories,
            {
              id: 'cat-' + Date.now(),
              user_id: 'user-demo',
              name,
              color_code: colorCode,
              created_at: new Date().toISOString(),
            },
          ],
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          todos: state.todos.map((t) => (t.category_id === id ? { ...t, category_id: null } : t)),
        })),
    }),
    {
      name: 'goalmate-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
