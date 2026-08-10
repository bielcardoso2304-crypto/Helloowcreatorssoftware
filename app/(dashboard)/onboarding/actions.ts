"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { creatorProfileSchema } from "@/lib/validations/creator";
import { uploadAvatarIfProvided } from "@/lib/upload-avatar";
import type { CreatorProfileActionState } from "../creator-profile-form";

export async function createCreatorProfile(
  _prevState: CreatorProfileActionState,
  formData: FormData
): Promise<CreatorProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = creatorProfileSchema.safeParse({
    full_name: formData.get("full_name"),
    stage_name: formData.get("stage_name"),
    email: formData.get("email"),
    birth_date: formData.get("birth_date"),
    whatsapp: formData.get("whatsapp"),
    city_state: formData.get("city_state"),
    bio: formData.get("bio"),
    niche: formData.get("niche"),
    main_platform: formData.get("main_platform"),
    instagram_handle: formData.get("instagram_handle"),
    instagram_url: formData.get("instagram_url"),
    instagram_followers: formData.get("instagram_followers"),
    tiktok_handle: formData.get("tiktok_handle"),
    tiktok_url: formData.get("tiktok_url"),
    tiktok_followers: formData.get("tiktok_followers"),
    youtube_handle: formData.get("youtube_handle"),
    youtube_url: formData.get("youtube_url"),
    youtube_followers: formData.get("youtube_followers"),
    other_platform_name: formData.get("other_platform_name"),
    other_url: formData.get("other_url"),
    preferred_contact: formData.get("preferred_contact"),
    commercial_info: formData.get("commercial_info"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { avatarUrl, error: avatarError } = await uploadAvatarIfProvided(
    supabase,
    user.id,
    formData.get("avatar")
  );
  if (avatarError) {
    return { error: avatarError };
  }

  const { error } = await supabase.from("creators").insert({
    user_id: user.id,
    avatar_url: avatarUrl ?? null,
    ...parsed.data,
  });
  if (error) {
    return { error: "Não foi possível salvar seu perfil. Tente novamente." };
  }

  redirect("/");
}
