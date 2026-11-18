-- Integrity Rising security hardening
-- Restrict direct RPC execution of trigger-only functions and remove anonymous
-- execution from moderator helpers while preserving authenticated RLS/dashboard use.
-- Apply this migration in the Supabase SQL Editor after reviewing it.

begin;

-- Trigger-only: clients must not be able to invoke profile creation directly.
-- The auth.users trigger continues to invoke this function on signup.
revoke execute on function public.handle_new_user_profile()
  from public, anon, authenticated;

-- Moderator helpers are used by RLS policies; the community moderation
-- dashboard also calls is_community_moderator() through supabase.rpc().
-- Keep authenticated execution, but remove anonymous and PUBLIC execution.
revoke execute on function public.is_community_moderator()
  from public, anon;
grant execute on function public.is_community_moderator()
  to authenticated;

-- This helper is referenced by the RLS policy on community_moderators.
-- Keep authenticated execution so that policy evaluation continues to work.
revoke execute on function public.is_moderator()
  from public, anon;
grant execute on function public.is_moderator()
  to authenticated;

-- Pin trigger/helper functions to an empty search_path.
-- Referenced application objects are schema-qualified in their function bodies;
-- pg_catalog built-ins remain available implicitly.
alter function public.set_updated_at()
  set search_path = '';

alter function public.set_member_connections_updated_at()
  set search_path = '';

-- is_moderator() previously had no fixed search_path. Its body references
-- public.community_moderators and auth.uid() with schema qualification.
alter function public.is_moderator()
  set search_path = '';

commit;

-- Follow-up verification:
-- 1. Re-run Supabase Security Advisor.
-- 2. Test signup and automatic profile creation.
-- 3. Test signed-in moderator dashboard and regular member access.
