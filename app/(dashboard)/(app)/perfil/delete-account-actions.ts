"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Self-service account deletion (LGPD art. 18) — any logged-in member can
 * delete their own account. Deleting the auth.users row (via the
 * service-role client, since there's no self-delete in the regular SDK)
 * cascades to their profile/deals/connections/event RSVPs, same as
 * deleteMember() in admin-member-actions.ts. */
export async function deleteMyAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(user.id);

  redirect("/login");
}
