import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Informe o nome da marca"),
});
export type BrandInput = z.infer<typeof brandSchema>;
