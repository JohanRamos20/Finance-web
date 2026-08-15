"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/api/client";
import { getGoals } from "@/api/goal";
import { Button } from "@/components/ui/Button";
import { GoalCard } from "@/components/goals/GoalCard";
import { NewGoalModal } from "@/components/goals/NewGoalModal";
import { ContributeGoalModal } from "@/components/goals/ContributeGoalModal";
import type { GoalDto } from "@/type/goal";

export default function GoalsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [goals, setGoals] = useState<GoalDto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [goalToContribute, setGoalToContribute] = useState<GoalDto | null>(null);

  const loadData = useCallback(async () => {
    const data = await getGoals();
    setGoals(data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await loadData();
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Não foi possível carregar as metas.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [loadData]);

  if (loading) {
    return <p className="text-sm text-text/60">Carregando...</p>;
  }

  const goalsCountLabel =
    goals.length === 1 ? "1 meta ativa" : `${goals.length} metas ativas`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-0.5 text-2xl font-medium">Metas</h1>
          <p className="text-sm text-text/60">{goalsCountLabel}</p>
        </div>
        <Button type="button" onClick={() => setModalOpen(true)}>
          Nova meta
        </Button>
      </div>

      {error && <p className="text-sm text-accent-300">{error}</p>}

      {goals.length === 0 ? (
        <p className="text-sm text-text/50">Nenhuma meta ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onContribute={setGoalToContribute} />
          ))}
        </div>
      )}

      <NewGoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadData}
      />

      <ContributeGoalModal
        goal={goalToContribute}
        onClose={() => setGoalToContribute(null)}
        onContributed={loadData}
      />
    </div>
  );
}
