import { Currencies } from "./currencies";

export function DateToUTCDate(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}

// export function GetFormatterForCurrency(currency: string) {
//   const locale = Currencies.find((curr) => curr.value === currency)?.locale;

//   return new Intl.NumberFormat(locale, {
//     style: "currency",
//     currency,
//   });
// }

export function GetFormatterForCurrency(currency: string) {
  const locale = Currencies.find((curr) => curr.value === currency)?.locale;

  if (!locale) {
    throw new Error(`Locale not found for currency: ${currency}`);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: currency === "NPR" ? "narrowSymbol" : "symbol",
  });
}
