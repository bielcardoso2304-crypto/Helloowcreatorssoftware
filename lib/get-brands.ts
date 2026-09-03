import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Brand = {
  id: string;
  name: string;
  created_at: string;
};

/** All registered brands, for the admin "manage brands" screen. */
export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("name");

  return data ?? [];
}

export type BrandOption = { id: string; name: string };

/** Options for the "which brand" select on the new-deal form. */
export async function getBrandOptions(): Promise<BrandOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  return data ?? [];
}
