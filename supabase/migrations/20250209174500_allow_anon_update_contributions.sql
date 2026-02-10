-- Allow anon update to user_contributions table for admin review
-- In a real app, we would strictly check for admin role, but for this demo with 'anon' auth, we open it up
DROP POLICY IF EXISTS "Allow anon update contributions" ON public.user_contributions;
CREATE POLICY "Allow anon update contributions"
  ON public.user_contributions FOR UPDATE
  TO anon
  USING (true);
