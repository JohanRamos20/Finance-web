import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { GoalDto } from "@/type/goal";

interface GoalsHighlightProps {
  goals: GoalDto[];
}

export function GoalsHighlight({ goals }: GoalsHighlightProps) {
  const highlighted = goals.slice(0, 3);

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-[17px] font-medium">Metas em destaque</h2>

      {highlighted.length === 0 ? (
        <p className="text-sm text-text/50">Nenhuma meta ainda.</p>
      ) : (
        highlighted.map((goal) => {
          const percent = Math.round((goal.savedAmount / goal.targetAmount) * 100);
          const barWidth = Math.min(100, percent);

          return (
            <div key={goal.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[13px]">
                <span>{goal.name}</span>
                <span className="text-text/60">{percent}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-text/10">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })
      )}

      <Link href="/metas" className="mt-1 text-[13px] text-accent hover:underline">
        Ver todas as metas →
      </Link>
    </Card>
  );
}
