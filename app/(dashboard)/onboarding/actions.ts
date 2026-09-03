"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { creatorProfileSchema } from "@/lib/validations/creator";
import { brandProfileSchema } from "@/lib/validations/brand-profile";
import { uploadAvatarIfProvided } from "@/lib/upload-avatar";
import type { CreatorProfileActionState } from "../creator-profile-form";
import type { BrandProfileActionState } from "../brand-profile-form";

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
    instagram_followers: formData.get("instagram_followers"),
    tiktok_handle: formData.get("tiktok_handle"),
    tiktok_followers: formData.get("tiktok_followers"),
    youtube_handle: formData.get("youtube_handle"),
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

export async function createBrandProfile(
  _prevState: BrandProfileActionState,
  formData: FormData
): Promise<BrandProfileActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = brandProfileSchema.safeParse({
    company_name: formData.get("company_name"),
    contact_name: formData.get("contact_name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    city_state: formData.get("city_state"),
    segment: formData.get("segment"),
    bio: formData.get("bio"),
    website_url: formData.get("website_url"),
    instagram_handle: formData.get("instagram_handle"),
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

  const { error } = await supabase.from("brand_profiles").insert({
    user_id: user.id,
    avatar_url: avatarUrl ?? null,
    ...parsed.data,
  });
  if (error) {
    return { error: "Não foi possível salvar o perfil da marca. Tente novamente." };
  }

  redirect("/");
}
