import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import type { TransactionDto } from "@/type/transaction";

interface RecentTransactionsProps {
  transactions: TransactionDto[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[17px] font-medium">Transações recentes</h2>
        <Link href="/transacoes" className="text-[13px] text-accent hover:underline">
          Ver todas →
        </Link>
      </div>

      <TransactionsTable
        transactions={transactions.slice(0, 5)}
        emptyMessage="Nenhuma transação ainda."
      />
    </Card>
  );
}
