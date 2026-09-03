import "server-only";
import { createClient } from "@/lib/supabase/server";

export type BrandProfile = {
  id: string;
  user_id: string;
  avatar_url: string | null;
  company_name: string;
  contact_name: string;
  email: string;
  whatsapp: string;
  city_state: string;
  segment: string | null;
  bio: string | null;
  website_url: string | null;
  instagram_handle: string | null;
  instagram_url: string | null;
  created_at: string;
};

/** Returns the brand profile owned by the currently logged-in user, or
 * null if none exists (either a creator account, or pre-onboarding). */
export async function getCurrentBrandProfile(): Promise<BrandProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ?? null;
}

export type DirectoryBrandProfile = Omit<
  BrandProfile,
  "email" | "whatsapp"
>;

/** All brand profiles, for the "Início" directory — same privacy boundary
 * as getCreatorsDirectory() (see brand_profiles_directory in 0010). */
export async function getBrandProfilesDirectory(): Promise<
  DirectoryBrandProfile[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brand_profiles_directory")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getDirectoryBrandProfileById(
  id: string
): Promise<DirectoryBrandProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brand_profiles_directory")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ?? null;
}
