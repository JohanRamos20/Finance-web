import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatters";
import type { GoalDto } from "@/type/goal";

interface GoalCardProps {
  goal: GoalDto;
  onContribute: (goal: GoalDto) => void;
}

export function GoalCard({ goal, onContribute }: GoalCardProps) {
  const percent = Math.round((goal.savedAmount / goal.targetAmount) * 100);
  const barWidth = Math.min(100, percent);
  const isComplete = goal.savedAmount >= goal.targetAmount;

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <div className="text-xs text-text/50">
          Criada em {format(new Date(goal.createdAt), "dd MMM yyyy", { locale: ptBR })}
        </div>
        <div className="text-[17px] font-medium">{goal.name}</div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-text/10">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex justify-between text-[13px]">
        <span>
          {formatCurrency(goal.savedAmount)}{" "}
          <span className="text-text/55">de {formatCurrency(goal.targetAmount)}</span>
        </span>
        <span className="text-text/70">{percent}%</span>
      </div>

      {isComplete && (
        <span className="self-start rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
          Concluída
        </span>
      )}

      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={isComplete}
        onClick={() => onContribute(goal)}
      >
        Adicionar aporte
      </Button>
    </Card>
  );
}
