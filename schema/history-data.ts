import { z } from "zod";

export const HistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(1000).max(3000),
});

export type HistoryDataSchemaType = z.infer<typeof HistoryDataSchema>;
