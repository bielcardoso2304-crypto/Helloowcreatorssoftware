import "server-only";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

/** Uploads the given form file to the `avatars` bucket at
 * `${userId}/avatar.<ext>` (overwriting any previous photo) and returns its
 * public URL. Returns `{}` untouched if no file was actually selected —
 * callers should keep the existing avatar_url in that case. */
export async function uploadAvatarIfProvided(
  supabase: SupabaseServerClient,
  userId: string,
  file: FormDataEntryValue | null
): Promise<{ avatarUrl?: string; error?: string }> {
  if (!(file instanceof File) || file.size === 0) return {};

  if (!file.type.startsWith("image/")) {
    return { error: "A foto de perfil precisa ser uma imagem." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { error: "A foto de perfil precisa ter no máximo 5MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { error: "Não foi possível enviar a foto de perfil. Tente novamente." };
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  // Cache-bust so the browser doesn't keep showing a stale cached photo.
  return { avatarUrl: `${data.publicUrl}?t=${Date.now()}` };
}
