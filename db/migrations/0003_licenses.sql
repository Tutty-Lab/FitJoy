create table if not exists organizations (
 id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now()
);
create table if not exists license_batches (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations,
 seats integer not null check(seats between 1 and 1000), valid_until timestamptz not null,
 created_at timestamptz not null default now()
);
create table if not exists invitation_codes (
 id uuid primary key default gen_random_uuid(), batch_id uuid not null references license_batches,
 code_hash text not null unique, redeem_before timestamptz not null,
 redeemed_by uuid references users on delete set null, redeemed_at timestamptz, revoked_at timestamptz
);
create table if not exists entitlements (
 user_id uuid primary key references users on delete cascade,
 organization_id uuid references organizations, source text not null,
 valid_until timestamptz, created_at timestamptz not null default now()
);
-- Preserve existing accounts; rerunning this migration must not grant new accounts access.
create table if not exists schema_migrations (name text primary key);
insert into entitlements(user_id, source)
 select id, 'legacy' from users where not exists(select 1 from schema_migrations where name='0003_licenses')
 on conflict do nothing;
insert into schema_migrations values('0003_licenses') on conflict do nothing;
create table if not exists redeem_attempts (
 user_id uuid primary key references users on delete cascade, window_start timestamptz not null default now(), attempts integer not null default 0
);
create or replace function redeem_invitation(p_user uuid, p_hash text) returns text language plpgsql as $$
declare invitation invitation_codes%rowtype; batch license_batches%rowtype;
begin
 perform 1 from users where id=p_user for update;
 if not found then return 'account_missing'; end if;
 insert into redeem_attempts(user_id,attempts) values(p_user,1)
 on conflict(user_id) do update set
 attempts=case when redeem_attempts.window_start < now()-interval '15 minutes' then 1 else redeem_attempts.attempts+1 end,
 window_start=case when redeem_attempts.window_start < now()-interval '15 minutes' then now() else redeem_attempts.window_start end;
 if (select attempts from redeem_attempts where user_id=p_user)>10 then return 'rate_limit'; end if;
 select * into invitation from invitation_codes where code_hash=p_hash for update;
 if not found then return 'invalid'; end if;
 if invitation.redeemed_at is not null then
  if invitation.redeemed_by=p_user then return 'already_redeemed'; end if;
  return 'invalid';
 end if;
 if invitation.revoked_at is not null or invitation.redeem_before<=now() then return 'invalid'; end if;
 select * into batch from license_batches where id=invitation.batch_id;
 if batch.valid_until<=now() then return 'invalid'; end if;
 if exists(select 1 from entitlements where user_id=p_user and (valid_until is null or valid_until>now())) then return 'already_active'; end if;
 if exists(select 1 from entitlements where user_id=p_user and organization_id is not null and organization_id<>batch.organization_id) then return 'different_organization'; end if;
 insert into entitlements(user_id,organization_id,source,valid_until) values(p_user,batch.organization_id,'organization',batch.valid_until)
 on conflict(user_id) do update set organization_id=excluded.organization_id,source=excluded.source,valid_until=excluded.valid_until;
 update invitation_codes set redeemed_by=p_user,redeemed_at=now() where id=invitation.id;
 return 'redeemed';
end $$;
