-- ====================================================================
-- GoalMate Database Schema & Security Policies (Supabase / PostgreSQL)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Profile Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Goal Categories Table
CREATE TABLE IF NOT EXISTS public.goal_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color_code VARCHAR(10) NOT NULL DEFAULT '#8B5CF6', -- 기본 Violet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Todos & Numeric Tracking Table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.goal_categories(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('binary', 'numeric', 'timer')),
  target_value INT DEFAULT 1,
  current_value INT DEFAULT 0,
  unit VARCHAR(20) DEFAULT '회',
  due_date DATE NOT NULL,
  due_time TIME,
  is_completed BOOLEAN DEFAULT FALSE,
  is_inbox BOOLEAN DEFAULT FALSE, -- 주의력 잔여물 방지용 보관함 플래그
  is_recurring BOOLEAN DEFAULT FALSE,
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('private', 'friends', 'public')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Daily Logs (Mood & Diary) Table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  mood_emoji VARCHAR(10),
  one_line_diary TEXT,
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('private', 'friends', 'public')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, log_date)
);

-- 6. Follows Table (Social Network)
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- ====================================================================
-- Performance Indexes
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_todos_user_due_date ON public.todos(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_todos_inbox ON public.todos(user_id, is_inbox);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs(user_id, log_date);

-- ====================================================================
-- Row Level Security (RLS) Policies
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Users Policy
CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Categories Policy
CREATE POLICY "Users can manage own categories" ON public.goal_categories
  FOR ALL USING (auth.uid() = user_id);

-- Todos Policy
CREATE POLICY "Users can manage own todos" ON public.todos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "View public todos" ON public.todos
  FOR SELECT USING (
    privacy_level = 'public' 
    OR (auth.uid() = user_id)
    OR (
      privacy_level = 'friends' AND EXISTS (
        SELECT 1 FROM public.follows 
        WHERE follower_id = auth.uid() AND following_id = public.todos.user_id
      )
    )
  );

-- Daily Logs Policy
CREATE POLICY "Users can manage own daily logs" ON public.daily_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "View public daily logs" ON public.daily_logs
  FOR SELECT USING (
    privacy_level = 'public' 
    OR (auth.uid() = user_id)
    OR (
      privacy_level = 'friends' AND EXISTS (
        SELECT 1 FROM public.follows 
        WHERE follower_id = auth.uid() AND following_id = public.daily_logs.user_id
      )
    )
  );

-- Follows Policy
CREATE POLICY "Users can manage follows" ON public.follows
  FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Anyone can view follows" ON public.follows
  FOR SELECT USING (true);
