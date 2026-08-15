export type Category =
  | "LEISURE"
  | "GROCERIES"
  | "EXPENSES"
  | "SHOPPING"
  | "FOOD"
  | "SALARY";

export type TransactionType = "DEBIT" | "CREDIT";

export interface TransactionDto {
  name: string;
  amount: number;
  category: Category;
  transactionType: TransactionType;
  createdAt: string;
}

export interface CreateTransactionPayload {
  name: string;
  amount: number;
  category: Category;
  transactionType: TransactionType;
}

export interface TransactionFilters {
  category?: Category;
  transactionType?: TransactionType;
}
