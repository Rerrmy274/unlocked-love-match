-- Create custom types
CREATE TYPE gender_type AS ENUM ('male', 'female', 'non-binary', 'prefer_not_to_say');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE report_status AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER CHECK (age >= 18),
  gender gender_type,
  location TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status match_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_users CHECK (user1_id != user2_id),
  UNIQUE (user1_id, user2_id)
);

-- Enable RLS for matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT,
  image_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  reported_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Blocked users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (blocker_id, blocked_id)
);

-- Enable RLS for blocked users
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: 
-- Anyone authenticated can view other profiles (for discovery)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (auth.role() = 'authenticated');

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Matches:
-- Users can see their own matches
CREATE POLICY "Users can see their own matches" 
ON public.matches FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can create a match/like
CREATE POLICY "Users can create matches" 
ON public.matches FOR INSERT 
WITH CHECK (auth.uid() = user1_id);

-- Messages:
-- Users can see messages in their matches
CREATE POLICY "Users can see messages in their matches" 
ON public.messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Users can send messages to their matches
CREATE POLICY "Users can send messages to their matches" 
ON public.messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = messages.match_id 
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Reports:
-- Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports" 
ON public.reports FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

-- Only admins can see reports (placeholder role check)
-- Note: Assuming a simple check for now, can be refined
CREATE POLICY "Admins can view reports" 
ON public.reports FOR SELECT 
USING (auth.jwt() ->> 'email' LIKE '%@patampoa.admin');

-- Blocked Users:
-- Users can see their own block list
CREATE POLICY "Users can see their block list" 
ON public.blocked_users FOR SELECT 
USING (auth.uid() = blocker_id);

-- Users can block others
CREATE POLICY "Users can block others" 
ON public.blocked_users FOR INSERT 
WITH CHECK (auth.uid() = blocker_id);

-- Triggers for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at)
  VALUES (new.id, new.raw_user_meta_data->>'name', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_profiles_location ON public.profiles(location);
CREATE INDEX idx_matches_users ON public.matches(user1_id, user2_id);
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_blocked_users_blocker ON public.blocked_users(blocker_id);