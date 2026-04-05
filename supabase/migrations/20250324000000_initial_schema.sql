-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  age INTEGER,
  gender TEXT,
  location TEXT,
  bio TEXT,
  interests TEXT[],
  photos TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING ( TRUE );

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = user_id );

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches"
  ON public.matches FOR SELECT
  USING ( auth.uid() = user1_id OR auth.uid() = user2_id );

CREATE POLICY "Users can create a match"
  ON public.matches FOR INSERT
  WITH CHECK ( auth.uid() = user1_id );

CREATE POLICY "Users can update their own matches"
  ON public.matches FOR UPDATE
  USING ( auth.uid() = user1_id OR auth.uid() = user2_id );

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their matches"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = messages.match_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their matches"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = messages.match_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reported_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING ( auth.uid() = reporter_id );

CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK ( auth.uid() = reporter_id );

-- Create blocked_users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocks"
  ON public.blocked_users FOR SELECT
  USING ( auth.uid() = blocker_id );

CREATE POLICY "Users can block others"
  ON public.blocked_users FOR INSERT
  WITH CHECK ( auth.uid() = blocker_id );

CREATE POLICY "Users can unblock others"
  ON public.blocked_users FOR DELETE
  USING ( auth.uid() = blocker_id );

-- Function to handle likes and matching logic
CREATE OR REPLACE FUNCTION public.handle_like(target_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  existing_match_id UUID;
  existing_status TEXT;
BEGIN
  -- Check if they already liked me
  SELECT id, status INTO existing_match_id, existing_status
  FROM public.matches
  WHERE user1_id = target_user_id AND user2_id = auth.uid();

  IF existing_match_id IS NOT NULL THEN
    -- It's a match!
    UPDATE public.matches
    SET status = 'accepted'
    WHERE id = existing_match_id;
    RETURN 'match';
  ELSE
    -- Check if I already liked them
    SELECT id INTO existing_match_id
    FROM public.matches
    WHERE user1_id = auth.uid() AND user2_id = target_user_id;

    IF existing_match_id IS NULL THEN
      -- New like
      INSERT INTO public.matches (user1_id, user2_id, status)
      VALUES (auth.uid(), target_user_id, 'pending');
    END IF;
    RETURN 'pending';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON public.messages(match_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_id ON public.reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker_id ON public.blocked_users(blocker_id);