-- Create selected_workspace table
create table public.selected_workspace (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null
);

-- Enable RLS
alter table public.selected_workspace enable row level security;

-- Create policies
create policy "Users can view their own selected workspace"
  on public.selected_workspace for select
  using (auth.uid() = user_id);

create policy "Users can insert their own selected workspace"
  on public.selected_workspace for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own selected workspace"
  on public.selected_workspace for update
  using (auth.uid() = user_id);

create policy "Users can delete their own selected workspace"
  on public.selected_workspace for delete
  using (auth.uid() = user_id);

-- Create function to initialize selected_workspace for new users
create or replace function public.handle_new_user_selected_workspace()
returns trigger as $$
begin
  insert into public.selected_workspace (user_id, workspace_id)
  values (new.id, null);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users
create trigger on_auth_user_created_selected_workspace
  after insert on auth.users
  for each row
  execute function public.handle_new_user_selected_workspace();