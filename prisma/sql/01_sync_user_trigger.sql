-- Run this once in the Supabase SQL editor AFTER `prisma db push` has created
-- the `users` table. Keeps public.users in sync with Supabase's auth.users.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, "displayName", "avatarUrl", "isGuest", "createdAt", "updatedAt")
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'is_guest')::boolean, false),
    now(),
    now()
  )
  on conflict (id) do nothing;

  -- Seed default Settings row for the new user
  insert into public.settings (id, "userId", "updatedAt")
  values (gen_random_uuid(), new.id, now())
  on conflict ("userId") do nothing;

  -- Seed a default Collection
  insert into public.collections (id, "userId", name, "isDefault", "createdAt", "updatedAt")
  values (gen_random_uuid(), new.id, 'My Collection', true, now(), now())
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
