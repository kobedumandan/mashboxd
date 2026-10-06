-- Mashboxd: auth hardening (Phase 0).
-- 1. Record which Terms version each user accepted.
-- 2. Remember Steam OpenID nonces so a Steam sign-in response can't be replayed.

alter table public.profiles add column terms_version text;
update public.profiles set terms_version = '2026-10-06' where terms_version is null;
alter table public.profiles alter column terms_version set not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id, username, display_name, favorite_platforms, favorite_genres, terms_accepted_at, terms_version
  )
  values (
    new.id,
    lower(new.raw_user_meta_data ->> 'username'),
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    coalesce(array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'favorite_platforms')), '{}'),
    coalesce(array(select jsonb_array_elements_text(new.raw_user_meta_data -> 'favorite_genres')), '{}'),
    (new.raw_user_meta_data ->> 'terms_accepted_at')::timestamptz,
    coalesce(new.raw_user_meta_data ->> 'terms_version', 'unknown')
  );
  return new;
end;
$$;

-- Only the API (secret key) touches this table. RLS on with no policies blocks everyone else.
create table public.steam_openid_nonces (
  nonce      text primary key,
  created_at timestamptz not null default now()
);

alter table public.steam_openid_nonces enable row level security;
revoke all on public.steam_openid_nonces from anon, authenticated;
