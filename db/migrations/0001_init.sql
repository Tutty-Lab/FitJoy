-- FitJoy schema for Neon Postgres. Access control is enforced in the API (api/_lib.ts),
-- not in the database: the browser never talks to Postgres directly.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  password_hash text not null,
  -- App-specific profile fields (goal, measurements, reminders…) so the client can evolve freely.
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists completions (
  user_id uuid not null references users on delete cascade,
  day int not null check (day between 1 and 22),
  completed_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Calendar days the user worked out, for streaks.
create table if not exists activity_days (
  user_id uuid not null references users on delete cascade,
  date date not null,
  primary key (user_id, date)
);

-- Admin edits layered over the seed catalog in src/data/workouts.ts.
create table if not exists workout_overrides (
  day int primary key check (day between 1 and 22),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references users on delete set null
);

-- Promote an account after it signs up once:
--   update users set role = 'admin' where email = 'you@example.com';
