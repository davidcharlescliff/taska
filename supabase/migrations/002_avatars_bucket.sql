-- ── Avatars storage bucket ────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Each user can only read/write their own folder (<user_id>/*)
create policy "avatar upload"
  on storage.objects for insert
  with check (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatar update"
  on storage.objects for update
  using (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatar delete"
  on storage.objects for delete
  using (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read (bucket is public so this is belt-and-suspenders)
create policy "avatar public read"
  on storage.objects for select
  using (bucket_id = 'avatars');
