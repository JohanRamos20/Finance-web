import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";

interface SummaryCardsProps {
  balance: number;
  income: number;
  expense: number;
}

export function SummaryCards({ balance, income, expense }: SummaryCardsProps) {
  const savings = income - expense;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="text-[10px] tracking-wide text-accent uppercase">
          Saldo atual
        </div>
        <div className="text-[26px] font-medium">{formatCurrency(balance)}</div>
      </Card>
      <Card>
        <div className="text-[10px] tracking-wide text-accent uppercase">
          Receitas do mês
        </div>
        <div className="text-[26px] font-medium text-accent-300">
          {formatCurrency(income)}
        </div>
      </Card>
      <Card>
        <div className="text-[10px] tracking-wide text-accent uppercase">
          Despesas do mês
        </div>
        <div className="text-[26px] font-medium">{formatCurrency(expense)}</div>
      </Card>
      <Card>
        <div className="text-[10px] tracking-wide text-accent uppercase">
          Economia do mês
        </div>
        <div className="text-[26px] font-medium">{formatCurrency(savings)}</div>
      </Card>
    </div>
  );
}
