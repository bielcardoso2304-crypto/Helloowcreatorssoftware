import { z } from "zod";

export const dealSchema = z.object({
  creator_id: z.string().uuid("Selecione um criador"),
  brand_id: z.string().uuid("Selecione uma marca"),
  deal_value: z.coerce.number().min(0, "Valor inválido"),
  commission_pct: z.coerce
    .number()
    .min(0, "Comissão deve ser entre 0 e 100")
    .max(100, "Comissão deve ser entre 0 e 100"),
  deal_date: z.string().min(1, "Informe a data"),
});
export type DealInput = z.infer<typeof dealSchema>;
