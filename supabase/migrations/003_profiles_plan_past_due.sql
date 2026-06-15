alter table public.profiles drop constraint profiles_plan_check;

alter table public.profiles add constraint profiles_plan_check
  check (plan in ('trial','pro','expired','past_due'));
