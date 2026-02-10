-- Disable RLS on users and user_contributions to allow "Simple Login" (anonymous) access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_contributions DISABLE ROW LEVEL SECURITY;

-- Allow anonymous uploads to storage
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Public Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'contributions' );
