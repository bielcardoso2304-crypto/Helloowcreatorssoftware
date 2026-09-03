import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Link inválido")
  .optional()
  .or(z.literal(""));

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const brandProfileSchema = z.object({
  company_name: z.string().trim().min(2, "Informe o nome da marca"),
  contact_name: z.string().trim().min(2, "Informe o nome do contato"),
  email: z.string().trim().email("E-mail inválido"),
  whatsapp: z.string().trim().min(8, "Informe um número de WhatsApp válido"),
  city_state: z.string().trim().min(2, "Informe cidade e estado"),
  segment: optionalText(200),
  bio: optionalText(500),
  website_url: optionalUrl,
  instagram_handle: optionalText(100),
});
export type BrandProfileInput = z.infer<typeof brandProfileSchema>;
