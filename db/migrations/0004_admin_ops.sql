create table if not exists audit_events (
 id uuid primary key default gen_random_uuid(), actor_id uuid references users on delete set null,
 organization_id uuid references organizations on delete set null, action text not null,
 entity_type text not null, entity_id uuid, metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists audit_events_created_idx on audit_events(created_at desc);
create index if not exists audit_events_org_idx on audit_events(organization_id, created_at desc);
create table if not exists organization_members (
 organization_id uuid not null references organizations on delete cascade,
 user_id uuid not null references users on delete cascade,
 member_role text not null default 'member' check(member_role in ('member','manager')),
 created_at timestamptz not null default now(), primary key(organization_id,user_id)
);
