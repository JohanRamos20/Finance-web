import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CATEGORY_LABELS } from "@/lib/calculations";
import { formatCurrency } from "@/lib/formatters";
import type { TransactionDto } from "@/type/transaction";

interface TransactionsTableProps {
  transactions: TransactionDto[];
  emptyMessage: string;
}

export function TransactionsTable({
  transactions,
  emptyMessage,
}: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-text/50">{emptyMessage}</p>
    );
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="text-left text-[11px] tracking-wide text-text/50 uppercase">
          <th className="whitespace-nowrap py-2 font-normal">Data</th>
          <th className="py-2 font-normal">Descrição</th>
          <th className="py-2 font-normal">Categoria</th>
          <th className="whitespace-nowrap py-2 text-right font-normal">Valor</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => {
          const isIncome = tx.transactionType === "CREDIT";
          return (
            <tr key={`${tx.name}-${tx.createdAt}`} className="border-t border-divider">
              <td className="whitespace-nowrap py-2 text-text/60">
                {format(new Date(tx.createdAt), "dd MMM", { locale: ptBR })}
              </td>
              <td className="py-2">{tx.name}</td>
              <td className="py-2">
                <span className="rounded-full bg-text/10 px-2 py-0.5 text-xs">
                  {CATEGORY_LABELS[tx.category]}
                </span>
              </td>
              <td
                className={
                  isIncome
                    ? "whitespace-nowrap py-2 text-right text-accent-300"
                    : "whitespace-nowrap py-2 text-right"
                }
              >
                {isIncome ? "+ " : "– "}
                {formatCurrency(tx.amount)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
