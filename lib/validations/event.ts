import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

// "" -> undefined so it's sent as null to Postgres instead of tripping the
// `time` column's type parser (which rejects "").
const optionalTime = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().optional()
);

export const eventSchema = z.object({
  title: z.string().trim().min(2, "Informe o título do evento"),
  description: optionalText(1000),
  location: optionalText(200),
  event_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data do evento"),
  event_time: optionalTime,
});
export type EventInput = z.infer<typeof eventSchema>;
