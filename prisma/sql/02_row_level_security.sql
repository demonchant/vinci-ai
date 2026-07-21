-- Row Level Security: every user-owned table is locked to auth.uid().
-- Run after prisma db push. Service-role key (used server-side only)
-- bypasses RLS automatically — never expose that key to the client.

alter table public.users enable row level security;
alter table public.collections enable row level security;
alter table public.collectibles enable row level security;
alter table public.images enable row level security;
alter table public.image_analyses enable row level security;
alter table public.ai_chats enable row level security;
alter table public.chat_messages enable row level security;
alter table public.saved_searches enable row level security;
alter table public.collector_memories enable row level security;
alter table public.dna_snapshots enable row level security;
alter table public.achievements enable row level security;
alter table public.goals enable row level security;
alter table public.legacy_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.settings enable row level security;
alter table public.activity_logs enable row level security;
-- market_insights is global, read-only content — no RLS needed for SELECT.

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Own collections" on public.collections
  for all using (auth.uid() = "userId");

create policy "Own collectibles" on public.collectibles
  for all using (auth.uid() = "userId");

create policy "Own images" on public.images
  for all using (
    auth.uid() = (select "userId" from public.collectibles where id = "collectibleId")
  );

create policy "Own image analyses" on public.image_analyses
  for all using (auth.uid() = "userId");

create policy "Own chats" on public.ai_chats
  for all using (auth.uid() = "userId");

create policy "Own chat messages" on public.chat_messages
  for all using (
    auth.uid() = (select "userId" from public.ai_chats where id = "chatId")
  );

create policy "Own saved searches" on public.saved_searches
  for all using (auth.uid() = "userId");

create policy "Own memories" on public.collector_memories
  for all using (auth.uid() = "userId");

create policy "Own dna snapshots" on public.dna_snapshots
  for all using (auth.uid() = "userId");

create policy "Own achievements" on public.achievements
  for all using (auth.uid() = "userId");

create policy "Own goals" on public.goals
  for all using (auth.uid() = "userId");

create policy "Own legacy reports" on public.legacy_reports
  for all using (auth.uid() = "userId");

create policy "Own notifications" on public.notifications
  for all using (auth.uid() = "userId");

create policy "Own settings" on public.settings
  for all using (auth.uid() = "userId");

create policy "Own activity logs" on public.activity_logs
  for all using (auth.uid() = "userId");
