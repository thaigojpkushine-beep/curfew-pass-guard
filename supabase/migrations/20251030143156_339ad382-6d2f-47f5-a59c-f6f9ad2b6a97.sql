-- Populate user_roles for all existing users
-- This will insert roles for users that don't have entries in user_roles yet
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id,
  COALESCE(
    (raw_user_meta_data->>'role')::public.app_role,
    'user'::public.app_role
  ) as role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;