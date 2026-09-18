-- ============================================================
-- Ye Rater — schema
-- Run this whole file once in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- 1. PROFILES -------------------------------------------------
-- One row per signed-up user. Mirrors auth.users so we have a
-- public-safe place to store a display username.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by any logged-in user"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up, using the
-- username they passed in at signup (see app/signup/page.js).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. ALBUMS -----------------------------------------------------
create table if not exists public.albums (
  id serial primary key,
  title text not null,
  release_year int,
  sort_order int not null
);

alter table public.albums enable row level security;

create policy "Albums are viewable by any logged-in user"
  on public.albums for select
  using (auth.role() = 'authenticated');

-- 3. SONGS --------------------------------------------------------
create table if not exists public.songs (
  id serial primary key,
  album_id int not null references public.albums (id) on delete cascade,
  title text not null,
  track_number int not null
);

alter table public.songs enable row level security;

create policy "Songs are viewable by any logged-in user"
  on public.songs for select
  using (auth.role() = 'authenticated');

-- 4. RATINGS --------------------------------------------------------
create table if not exists public.ratings (
  id bigserial primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  song_id int not null references public.songs (id) on delete cascade,
  rating numeric(3, 1) not null check (rating >= 0 and rating <= 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, song_id)
);

alter table public.ratings enable row level security;

-- Everyone can see everyone else's ratings — that's the whole point
-- (comparing scores with friends, computing community means).
create policy "Ratings are viewable by any logged-in user"
  on public.ratings for select
  using (auth.role() = 'authenticated');

-- But you can only write your own.
create policy "Users can insert their own ratings"
  on public.ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own ratings"
  on public.ratings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own ratings"
  on public.ratings for delete
  using (auth.uid() = user_id);

-- Keep updated_at fresh on every edit.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ratings_set_updated_at on public.ratings;
create trigger ratings_set_updated_at
  before update on public.ratings
  for each row execute procedure public.set_updated_at();
