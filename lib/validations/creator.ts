import { z } from "zod";

const optionalFollowers = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().nonnegative().optional()
);

const optionalUrl = z
  .string()
  .trim()
  .url("Link inválido")
  .optional()
  .or(z.literal(""));

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

// "" -> undefined so it's sent as null to Postgres instead of tripping the
// `preferred_contact in (...)` check constraint (which rejects "" but
// allows null).
const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
  z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.enum(values).optional()
  );

export const creatorProfileSchema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome completo"),
  stage_name: optionalText(100),
  email: z.string().trim().email("E-mail inválido"),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe sua data de nascimento"),
  whatsapp: z.string().trim().min(8, "Informe um número de WhatsApp válido"),
  city_state: z.string().trim().min(2, "Informe cidade e estado"),
  bio: optionalText(500),
  niche: optionalText(500),
  main_platform: z.enum(["instagram", "tiktok", "youtube", "other"], {
    message: "Selecione a plataforma principal",
  }),
  instagram_handle: optionalText(100),
  instagram_url: optionalUrl,
  instagram_followers: optionalFollowers,
  tiktok_handle: optionalText(100),
  tiktok_url: optionalUrl,
  tiktok_followers: optionalFollowers,
  youtube_handle: optionalText(100),
  youtube_url: optionalUrl,
  youtube_followers: optionalFollowers,
  other_platform_name: optionalText(100),
  other_url: optionalUrl,
  preferred_contact: optionalEnum(["whatsapp", "email", "instagram"]),
  commercial_info: optionalText(1000),
});
export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;

