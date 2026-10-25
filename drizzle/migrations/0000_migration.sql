CREATE TABLE public.activity_results (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 30),
  score int not null default 0,
  records jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT ON public.activity_results TO anon, authenticated;
GRANT ALL ON public.activity_results TO service_role;
ALTER TABLE public.activity_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit" ON public.activity_results FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read for teacher view" ON public.activity_results FOR SELECT TO anon, authenticated USING (true);