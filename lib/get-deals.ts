import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Deal = {
  id: string;
  // Nullable: deleting a creator's account sets this to null instead of
  // deleting the deal (see 0014) — the revenue already happened and must
  // stay in the totals even after the account is gone.
  creator_id: string | null;
  brand_id: string;
  deal_value: number;
  commission_pct: number;
  company_earning: number;
  deal_date: string;
  created_at: string;
};

export type DealWithCreator = Deal & { creator_name: string; brand_name: string };

/** All deals, newest deal_date first, joined with brand names (deals.brand_id
 * has a real FK to `brands`, so PostgREST embeds it) and creator names
 * (joined in JS — deals.creator_id only references auth.users, which
 * PostgREST can't embed). Admin-only — deals RLS is is_admin(). */
export async function getDeals(): Promise<DealWithCreator[]> {
  const supabase = await createClient();
  const { data: deals } = await supabase
    .from("deals")
    .select("*, brands(name)")
    .order("deal_date", { ascending: false });

  if (!deals || deals.length === 0) return [];

  const { data: creators } = await supabase
    .from("creators")
    .select("user_id, full_name, stage_name");

  const nameByUserId = new Map(
    (creators ?? []).map((c) => [c.user_id, c.stage_name || c.full_name])
  );

  return deals.map(({ brands, ...d }) => ({
    ...d,
    creator_name:
      (d.creator_id && nameByUserId.get(d.creator_id)) || "Criador removido",
    brand_name: (brands as { name: string } | null)?.name ?? "Marca removida",
  }));
}

export type MemberRevenue = {
  dealCount: number;
  totalValue: number;
  totalEarning: number;
};

const emptyRevenue: MemberRevenue = { dealCount: 0, totalValue: 0, totalEarning: 0 };

function summarizeDeals(
  deals: { deal_value: number; company_earning: number }[]
): MemberRevenue {
  return {
    dealCount: deals.length,
    totalValue: deals.reduce((sum, d) => sum + d.deal_value, 0),
    totalEarning: deals.reduce((sum, d) => sum + d.company_earning, 0),
  };
}

/** How much a creator has generated for Helloow — deals.creator_id
 * references auth.users directly, so this is an exact match. Admin-only
 * (deals RLS is is_admin()). */
export async function getCreatorRevenue(
  creatorUserId: string
): Promise<MemberRevenue> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("deals")
    .select("deal_value, company_earning")
    .eq("creator_id", creatorUserId);

  return data ? summarizeDeals(data) : emptyRevenue;
}

/** How much a brand account has generated for Helloow. Deals are logged
 * against the admin-managed `brands` list (a brand can be logged there
 * before it ever signs up for an account), not against brand_profiles
 * directly — so this matches by company name. If the admin used a
 * different spelling when registering deals, this will read as zero. */
export async function getBrandRevenueByName(
  companyName: string
): Promise<MemberRevenue> {
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .ilike("name", companyName)
    .maybeSingle();
  if (!brand) return emptyRevenue;

  const { data } = await supabase
    .from("deals")
    .select("deal_value, company_earning")
    .eq("brand_id", brand.id);

  return data ? summarizeDeals(data) : emptyRevenue;
}

export type CreatorOption = { user_id: string; name: string };

/** Options for the "which creator" select on the new-deal form. */
export async function getCreatorOptions(): Promise<CreatorOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("creators")
    .select("user_id, full_name, stage_name")
    .order("full_name");

  return (data ?? []).map((c) => ({
    user_id: c.user_id,
    name: c.stage_name || c.full_name,
  }));
}
