export type TransactionType = "income" | "expense";

export type TimeFrame = "month" | "year";

export type Period = { year: number; month: number };

export type ExportedTransactionData = {
  category: string;
  categoryIcon: string;
  description: string;
  date: string;
  type: string;
  formattedAmount: string;
  amount: number;
};
