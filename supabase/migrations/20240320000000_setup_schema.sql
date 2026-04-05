-- Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  age integer,
  gender text,
  location text,
  bio text,
  interests text[],
  photos text[] DEFAULT '{}',
  verified boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create Matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted'
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_match_pair UNIQUE (user1_id, user2_id),
  CONSTRAINT user_order CHECK (user1_id < user2_id)
);

-- Create Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'resolved'
  created_at timestamptz DEFAULT now()
);

-- Create Blocked Users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_block_pair UNIQUE (blocker_id, blocked_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Matches Policies
CREATE POLICY "Users can view their own matches" 
ON public.matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create matches" 
ON public.matches FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their own matches"
ON public.matches FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages Policies
CREATE POLICY "Users can view messages in their matches" 
ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE public.matches.id = match_id 
    AND (public.matches.user1_id = auth.uid() OR public.matches.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages to their matches" 
ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE public.matches.id = match_id 
    AND (public.matches.user1_id = auth.uid() OR public.matches.user2_id = auth.uid())
  )
);

-- Reports Policies
CREATE POLICY "Users can create reports" 
ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view reports" 
ON public.reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Blocked Users Policies
CREATE POLICY "Users can view their own blocks" 
ON public.blocked_users FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "Users can block others" 
ON public.blocked_users FOR INSERT WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can unblock others" 
ON public.blocked_users FOR DELETE USING (auth.uid() = blocker_id);

-- Trigger to create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match ON public.messages(match_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON public.reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_blocked_blocker ON public.blocked_users(blocker_id);