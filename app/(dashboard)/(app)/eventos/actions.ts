"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/get-current-creator";
import { eventSchema } from "@/lib/validations/event";

export type EventActionState = { error: string | null };

export async function createEvent(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return { error: "Acesso negado." };

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    event_date: formData.get("event_date"),
    event_time: formData.get("event_time"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("events").insert({
    ...parsed.data,
    created_by: user.id,
  });
  if (error) {
    return { error: "Não foi possível criar o evento. Tente novamente." };
  }

  revalidatePath("/eventos");
  return { error: null };
}

export async function deleteEvent(id: string) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return;

  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);

  revalidatePath("/eventos");
}
