-- Create a storage bucket for contributions
insert into storage.buckets (id, name, public)
values ('contributions', 'contributions', true)
on conflict (id) do nothing;

-- Set up storage policies
-- Enable RLS on storage.objects if not already enabled (it usually is)
-- alter table storage.objects enable row level security;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'contributions' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'contributions' and auth.role() = 'authenticated' );

-- Make phone nullable in users table just in case
ALTER TABLE public.users ALTER COLUMN phone DROP NOT NULL;

-- Create a trigger to sync auth.users to public.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, phone, email, role)
  values (new.id, new.phone, new.email, 'user')
  on conflict (id) do update
  set email = excluded.email,
      phone = excluded.phone;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
