"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function connectCreator(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id === targetUserId) return;

  await supabase
    .from("connections")
    .upsert(
      { creator_id: user.id, connected_creator_id: targetUserId },
      { onConflict: "creator_id,connected_creator_id" }
    );

  revalidatePath("/");
  revalidatePath("/network");
}

export async function disconnectCreator(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("connections")
    .delete()
    .eq("creator_id", user.id)
    .eq("connected_creator_id", targetUserId);

  revalidatePath("/");
  revalidatePath("/network");
}
