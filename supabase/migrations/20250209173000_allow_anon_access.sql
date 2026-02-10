-- Allow anon access to public.users table for registration/login check
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read users" ON public.users;
CREATE POLICY "Allow anon read users"
  ON public.users FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anon insert users" ON public.users;
CREATE POLICY "Allow anon insert users"
  ON public.users FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update users" ON public.users;
CREATE POLICY "Allow anon update users"
  ON public.users FOR UPDATE
  TO anon
  USING (true);

-- Allow anon access to user_contributions table
-- We trust the frontend to send the correct user_id for now (Demo mode)
DROP POLICY IF EXISTS "Allow anon insert contributions" ON public.user_contributions;
CREATE POLICY "Allow anon insert contributions"
  ON public.user_contributions FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select contributions" ON public.user_contributions;
CREATE POLICY "Allow anon select contributions"
  ON public.user_contributions FOR SELECT
  TO anon
  USING (true);

-- Allow anon access to storage
-- Storage policies are often tricky, let's open it up for the 'contributions' bucket
DROP POLICY IF EXISTS "Allow anon upload contributions" ON storage.objects;
CREATE POLICY "Allow anon upload contributions"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK ( bucket_id = 'contributions' );

DROP POLICY IF EXISTS "Allow anon select contributions storage" ON storage.objects;
CREATE POLICY "Allow anon select contributions storage"
  ON storage.objects FOR SELECT
  TO anon
  USING ( bucket_id = 'contributions' );
