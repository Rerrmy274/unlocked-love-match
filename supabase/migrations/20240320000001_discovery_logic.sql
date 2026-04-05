-- Enable PostGIS for location-based search
CREATE EXTENSION IF NOT EXISTS postgis;

-- Update profiles table to include coordinates
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location_point geography(POINT, 4326);

-- Function to get potential matches for a user
CREATE OR REPLACE FUNCTION public.get_potential_matches(
  current_user_id uuid,
  target_gender text,
  min_age integer,
  max_age integer,
  max_distance_km float,
  limit_count integer DEFAULT 20
) 
RETURNS SETOF public.profiles AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM public.profiles p
  WHERE p.id != current_user_id
    AND (p.gender = target_gender OR target_gender IS NULL)
    AND (p.age >= min_age OR min_age IS NULL)
    AND (p.age <= max_age OR max_age IS NULL)
    AND (
      max_distance_km IS NULL OR 
      ST_DWithin(
        p.location_point, 
        (SELECT location_point FROM public.profiles WHERE id = current_user_id), 
        max_distance_km * 1000
      )
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.matches m 
      WHERE (m.user1_id = current_user_id AND m.user2_id = p.id) 
         OR (m.user2_id = current_user_id AND m.user1_id = p.id)
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users b 
      WHERE (b.blocker_id = current_user_id AND b.blocked_id = p.id)
         OR (b.blocker_id = p.id AND b.blocked_id = current_user_id)
    )
  ORDER BY 
    ST_Distance(
      p.location_point, 
      (SELECT location_point FROM public.profiles WHERE id = current_user_id)
    ) ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;