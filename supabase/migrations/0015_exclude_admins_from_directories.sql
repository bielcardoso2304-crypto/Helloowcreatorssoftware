-- Admin accounts (staff) shouldn't clutter the public member directory
-- that creators and brands browse — even when an admin also has a
-- creator/brand profile of their own (e.g. the account used to test the
-- app before being promoted).
create or replace view creators_directory as
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
from creators
where user_id not in (select user_id from admins);

create or replace view brand_profiles_directory as
select id, user_id, avatar_url, company_name, bio, city_state, segment,
  website_url, instagram_handle, instagram_url, created_at
from brand_profiles
where user_id not in (select user_id from admins);
