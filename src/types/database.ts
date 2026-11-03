export type TodoType = 'binary' | 'numeric' | 'timer';
export type PrivacyLevel = 'private' | 'friends' | 'public';

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string | null;
  created_at: string;
}

export interface GoalCategory {
  id: string;
  user_id: string;
  name: string;
  color_code: string;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  category_id?: string | null;
  title: string;
  type: TodoType;
  target_value: number;
  current_value: number;
  unit?: string | null;
  due_date: string; // YYYY-MM-DD
  due_time?: string | null;
  is_completed: boolean;
  is_inbox: boolean;
  is_recurring: boolean;
  repeat_type?: 'none' | 'daily' | 'weekday' | 'weekly';
  privacy_level: PrivacyLevel;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  mood_emoji?: string | null;
  one_line_diary?: string | null;
  privacy_level: PrivacyLevel;
  created_at: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface DaySummary {
  date: string;
  totalTodos: number;
  completedTodos: number;
  rate: number; // 0 to 100
  dominantColor?: string;
  moodEmoji?: string | null;
}
