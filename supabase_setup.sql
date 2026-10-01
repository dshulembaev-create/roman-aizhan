-- Выполни в Supabase: SQL Editor -> New query -> вставь -> Run

-- Настройки сайта (дата встречи, имена)
create table site_settings (
  id text primary key default 'main',
  person1_name text not null default 'Роман',
  person2_name text not null default 'Айжан',
  person1_city text not null default 'New York',
  person2_city text not null default 'Astana',
  meeting_date date not null default '2026-12-31',
  created_at timestamptz not null default now()
);
alter table site_settings enable row level security;
create policy "Allow all" on site_settings for all using (true) with check (true);

-- Записи дневника
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  author text not null check (author in ('person1','person2')),
  text text not null,
  created_at timestamptz not null default now()
);
alter table journal_entries enable row level security;
create policy "Allow read" on journal_entries for select using (true);
create policy "Allow insert" on journal_entries for insert with check (true);
alter publication supabase_realtime add table journal_entries;

-- Ответы на вопросы дня
create table daily_answers (
  id uuid primary key default gen_random_uuid(),
  question_index integer not null,
  author text not null check (author in ('person1','person2')),
  answer text not null,
  created_at timestamptz not null default now()
);
alter table daily_answers enable row level security;
create policy "Allow read" on daily_answers for select using (true);
create policy "Allow insert" on daily_answers for insert with check (true);
alter publication supabase_realtime add table daily_answers;
