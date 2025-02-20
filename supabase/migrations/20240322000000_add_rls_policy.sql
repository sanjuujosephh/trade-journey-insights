
-- Enable RLS
alter table public.trades enable row level security;

-- Create policies
create policy "Users can view their own trades"
  on public.trades for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own trades"
  on public.trades for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own trades"
  on public.trades for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own trades"
  on public.trades for delete
  using ( auth.uid() = user_id );
