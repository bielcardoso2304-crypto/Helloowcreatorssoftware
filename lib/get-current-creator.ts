import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Creator = {
  id: string;
  user_id: string;
  avatar_url: string | null;
  full_name: string;
  stage_name: string | null;
  email: string;
  birth_date: string;
  whatsapp: string;
  city_state: string;
  bio: string | null;
  niche: string | null;
  main_platform: "instagram" | "tiktok" | "youtube" | "other";
  instagram_handle: string | null;
  instagram_url: string | null;
  instagram_followers: number | null;
  tiktok_handle: string | null;
  tiktok_url: string | null;
  tiktok_followers: number | null;
  youtube_handle: string | null;
  youtube_url: string | null;
  youtube_followers: number | null;
  other_platform_name: string | null;
  other_url: string | null;
  preferred_contact: "whatsapp" | "email" | "instagram" | null;
  commercial_info: string | null;
  created_at: string;
};

/** Returns the creator profile owned by the currently logged-in user, or
 * null if none exists yet (pre-onboarding). Assumes a user is already
 * authenticated (call behind the (dashboard) auth guard). */
export async function getCurrentCreator(): Promise<Creator | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("creators")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ?? null;
}

/** Whether the currently logged-in user is a Helloow admin. Backed by the
 * is_admin() SQL function (SECURITY DEFINER), since the `admins` table
 * itself has no RLS policies that would let a normal request read it. */
export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_admin");
  return data === true;
}

export type DirectoryCreator = Omit<
  Creator,
  "email" | "birth_date" | "whatsapp" | "preferred_contact" | "commercial_info"
>;

/** All creator profiles, for the members directory shown on the home
 * page. Reads from `creators_directory` (a view that only exposes
 * non-sensitive columns) so private contact info never reaches other
 * members. */
export async function getCreatorsDirectory(): Promise<DirectoryCreator[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("creators_directory")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

/** A single directory profile by its `creators.id`, for the full-profile
 * page linked from member cards. Same privacy boundary as
 * getCreatorsDirectory() — no email/whatsapp/birth_date/commercial_info. */
export async function getDirectoryCreatorById(
  id: string
): Promise<DirectoryCreator | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("creators_directory")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ?? null;
}

/** user_ids the currently logged-in creator has added to their Network.
 * One-directional (like a follow list) — see 0005_connections.sql. */
export async function getConnectedUserIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("connections")
    .select("connected_creator_id")
    .eq("creator_id", user.id);

  return new Set((data ?? []).map((row) => row.connected_creator_id));
}
