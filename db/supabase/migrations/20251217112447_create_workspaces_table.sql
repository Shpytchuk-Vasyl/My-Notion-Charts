-- Create workspaces table
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Notion OAuth fields
  access_token text not null,
  refresh_token text not null,
  workspace_icon text,
  workspace_id text not null,
  workspace_name text not null,
  workspace_email text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint workspaces_user_workspace_unique unique (user_id, workspace_id)
);

-- Enable RLS
alter table public.workspaces enable row level security;

-- Create policies
create policy "Users can view their own workspaces"
  on public.workspaces for select
  using ((select auth.uid()) = user_id);

create policy "Users can create their own workspaces"
  on public.workspaces for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own workspaces"
  on public.workspaces for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete their own workspaces"
  on public.workspaces for delete
  using ((select auth.uid()) = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_workspaces
  before update on public.workspaces
  for each row
  execute function public.handle_updated_at();

-- Create indexes
create index workspaces_user_id_idx on public.workspaces(user_id);