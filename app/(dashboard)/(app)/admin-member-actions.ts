"use server";

import { redirect } from "next/navigation";
import { getIsAdmin } from "@/lib/get-current-creator";
import { createAdminClient } from "@/lib/supabase/admin";

/** Permanently deletes a member's account (creator or brand) — admin only.
 * Removes the auth.users row via the service-role client, which cascades
 * to their creators/brand_profiles/deals/connections/event_attendees rows
 * (all declared `on delete cascade` against auth.users). */
export async function deleteMember(userId: string) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return;

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);

  redirect("/");
}
