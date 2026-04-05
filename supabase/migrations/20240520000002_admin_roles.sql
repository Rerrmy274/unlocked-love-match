-- Add role type to profiles
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');

ALTER TABLE public.profiles 
ADD COLUMN role user_role DEFAULT 'user';

-- Update the admin policy to use the new role column
DROP POLICY IF EXISTS "Admins can view reports" ON public.reports;
CREATE POLICY "Admins and moderators can view reports" 
ON public.reports FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.role = 'admin' OR profiles.role = 'moderator')
  )
);

-- Policy for admins to manage all profiles
CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);