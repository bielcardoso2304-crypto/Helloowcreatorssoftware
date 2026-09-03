import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AdminDashboardStats = {
  total_creators: number;
  new_last_30_days: number;
  total_connections: number;
  total_reach: number;
  signups_by_month: { month: string; count: number }[];
  by_platform: {
    platform: "instagram" | "tiktok" | "youtube" | "other";
    count: number;
  }[];
  top_niches: { niche: string; count: number }[];
  total_deals: number;
  total_deal_value: number;
  total_company_earning: number;
  deals_by_month: { month: string; count: number }[];
  total_brands: number;
  new_brands_last_30_days: number;
  brand_signups_by_month: { month: string; count: number }[];
  top_brand_segments: { segment: string; count: number }[];
};

/** Aggregated counts for the admin dashboard, computed in Postgres by the
 * admin_dashboard_stats() function (0006 migration) — one round trip
 * instead of pulling every row down to compute this in JS. */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_dashboard_stats");
  if (error || !data) return null;
  return data as AdminDashboardStats;
}
