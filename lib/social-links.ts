/** Builds a profile URL straight from an @handle, instead of asking the
 * person to dig up and paste the link themselves. */
function urlFromHandle(base: string, handle: string | null): string | null {
  const clean = handle?.trim().replace(/^@/, "");
  return clean ? `${base}${clean}` : null;
}

export const instagramUrl = (handle: string | null) =>
  urlFromHandle("https://instagram.com/", handle);

export const tiktokUrl = (handle: string | null) =>
  urlFromHandle("https://tiktok.com/@", handle);

export const youtubeUrl = (handle: string | null) =>
  urlFromHandle("https://youtube.com/@", handle);
