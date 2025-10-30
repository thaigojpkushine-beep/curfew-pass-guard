-- Promote kylie22jacob@gmail.com to admin
-- First, delete any existing role for this user
DELETE FROM public.user_roles
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'kylie22jacob@gmail.com'
);

-- Then insert the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'kylie22jacob@gmail.com';