-- Public-facing directory of members: every logged-in creator can browse
-- everyone else's profile (name, photo, niche, socials...), but private
-- contact info (email, whatsapp, birth_date, commercial_info) stays
-- visible only to the creator themself and to admins via the base
-- `creators` table/RLS. Exposing only a safe column subset through a
-- view — instead of loosening RLS on `creators` itself — is what keeps
-- that PII out of reach for other members.
create view creators_directory as
select
  id,
  user_id,
  avatar_url,
  full_name,
  stage_name,
  bio,
  city_state,
  niche,
  main_platform,
  instagram_handle, instagram_url, instagram_followers,
  tiktok_handle, tiktok_url, tiktok_followers,
  youtube_handle, youtube_url, youtube_followers,
  other_platform_name, other_url,
  created_at
from creators;

-- The view runs with its owner's privileges (a role with BYPASSRLS, same
-- reasoning as is_admin() in 0001), so granting select here does not
-- require any RLS policy change on `creators` itself.
grant select on creators_directory to authenticated;
