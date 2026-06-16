# Supabase Realtime Setup

TrackHub can run locally with `localStorage`, but multi-user realtime updates require Supabase.

## Environment Variables

Create `.env.local` for local development:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

For GitHub Pages, add these as repository secrets or build environment variables in your deployment flow.

## SQL

Run this in the Supabase SQL editor:

```sql
create table if not exists public.trackhub_proposal_details (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.trackhub_proposal_details replica identity full;

alter table public.trackhub_proposal_details enable row level security;

create policy "proposal details read"
on public.trackhub_proposal_details
for select
using (true);

create policy "proposal details insert"
on public.trackhub_proposal_details
for insert
with check (true);

create policy "proposal details update"
on public.trackhub_proposal_details
for update
using (true)
with check (true);

insert into public.trackhub_proposal_details (id, state)
values (
  'default',
  '{"columns":[],"rows":[],"nextIdNumber":1}'::jsonb
)
on conflict (id) do nothing;
```

Then enable Realtime for `trackhub_proposal_details` in Supabase:

```sql
alter publication supabase_realtime add table public.trackhub_proposal_details;
```

This is intentionally simple for the temporary public dashboard. Before production, add authentication and stricter row-level security.
