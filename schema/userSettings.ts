import { Currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const validCurrency = Currencies.some((v) => v.value === value);
    if (!validCurrency) throw new Error(`Invalid currency ${value}`);
    return value;
  }),
});
