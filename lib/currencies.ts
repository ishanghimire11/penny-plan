export const Currencies = [
  {
    id: 1,
    value: "USD",
    label: "$ Dollar",
    locale: "en-US",
  },
  // {
  //   id: 2,
  //   value: "NPR",
  //   label: "रु Rupees",
  //   locale: "ne-NP",
  // },
  {
    id: 3,
    value: "GBP",
    label: "£ Pound",
    locale: "en-GB",
  },
  {
    id: 4,
    value: "EUR",
    label: "€ Euro",
    locale: "de-DE",
  },
  {
    id: 5,
    value: "JPY",
    label: "¥ Yen",
    locale: "ja-JP",
  },
];

export type Currency = (typeof Currencies)[0];
