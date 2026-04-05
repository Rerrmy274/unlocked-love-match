-- Create a storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
-- Allows anyone to view photos
CREATE POLICY "Publicly accessible photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-photos');

-- Allows authenticated users to upload their own photos
-- Note: Logic ensures photos are stored in folders matching user IDs
CREATE POLICY "Users can upload their own photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allows authenticated users to update/delete their own photos
CREATE POLICY "Users can update their own photos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'profile-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own photos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'profile-photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);