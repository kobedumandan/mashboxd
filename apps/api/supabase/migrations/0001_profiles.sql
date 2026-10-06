-- Mashboxd: user profiles.
-- One row per auth.users row, created by trigger from the metadata the API
-- passes to supabase.auth.signUp().

create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  username           text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name       text check (char_length(display_name) between 1 and 40),
  favorite_platforms text[] not null default '{}',
  favorite_genres    text[] not null default '{}',
  steam_id           text unique check (steam_id ~ '^[0-9]{17}$'),
  terms_accepted_at  timestamptz not null,
  created_at         timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles are public, like Letterboxd.
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users may edit their own row, but only the columns granted below.
-- username, steam_id and terms_accepted_at are written by the API with the
-- secret key (steam_id only after Steam OpenID verification).
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (display_name, favorite_platforms, favorite_genres) on public.profiles to authenticated;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id, username, display_name, favorite_platforms, favorite_genres, terms_accepted_at
  )
  values (
    new.id,
    lower(new.raw_user_meta_data ->> 'username'),
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    coalesce(array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'favorite_platforms')), '{}'),
    coalesce(array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'favorite_genres')), '{}'),
    (new.raw_user_meta_data ->> 'terms_accepted_at')::timestamptz
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
