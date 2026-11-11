-- Existing email accounts remain valid. New customers only need a username.
alter table users add column if not exists username text;
alter table users alter column email drop not null;
create unique index if not exists users_username_unique on users (lower(username));
