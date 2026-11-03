DROP POLICY IF EXISTS "anyone can read for teacher view" ON public.activity_results;
DROP POLICY IF EXISTS "anyone can submit" ON public.activity_results;
REVOKE SELECT, UPDATE, DELETE ON public.activity_results FROM anon, authenticated;
GRANT INSERT ON public.activity_results TO anon, authenticated;
GRANT ALL ON public.activity_results TO service_role;
CREATE POLICY "students submit valid results" ON public.activity_results FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(nickname)) BETWEEN 1 AND 30
  AND score BETWEEN 0 AND 100
  AND jsonb_typeof(records) = 'array'
  AND jsonb_array_length(records) <= 10
);