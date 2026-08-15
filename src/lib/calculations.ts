import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Category, TransactionDto } from "@/type/transaction";

export const CATEGORY_LABELS: Record<Category, string> = {
  LEISURE: "Lazer",
  GROCERIES: "Mercado",
  EXPENSES: "Despesas",
  SHOPPING: "Compras",
  FOOD: "Alimentação",
  SALARY: "Salário",
};

interface MonthTotals {
  income: number;
  expense: number;
}

function sumByType(transactions: TransactionDto[]): MonthTotals {
  return transactions.reduce<MonthTotals>(
    (totals, tx) => {
      if (tx.transactionType === "CREDIT") {
        totals.income += tx.amount;
      } else {
        totals.expense += tx.amount;
      }
      return totals;
    },
    { income: 0, expense: 0 },
  );
}

export function getCurrentMonthTotals(transactions: TransactionDto[]): MonthTotals {
  const monthKey = format(new Date(), "yyyy-MM");
  const monthTransactions = transactions.filter(
    (tx) => tx.createdAt.slice(0, 7) === monthKey,
  );
  return sumByType(monthTransactions);
}

export interface MonthlyChartPoint {
  month: string;
  income: number;
  expense: number;
}

export function getMonthlyChartData(
  transactions: TransactionDto[],
  months = 6,
): MonthlyChartPoint[] {
  const currentMonth = startOfMonth(new Date());

  return Array.from({ length: months }, (_, index) => {
    const monthDate = subMonths(currentMonth, months - 1 - index);
    const monthKey = format(monthDate, "yyyy-MM");
    const monthTransactions = transactions.filter(
      (tx) => tx.createdAt.slice(0, 7) === monthKey,
    );
    const totals = sumByType(monthTransactions);

    return {
      month: format(monthDate, "MMM", { locale: ptBR }),
      income: totals.income,
      expense: totals.expense,
    };
  });
}
