"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/api/client";
import { getBalance } from "@/api/wallet";
import { getTransactions } from "@/api/transaction";
import { getGoals } from "@/api/goal";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { GoalsHighlight } from "@/components/dashboard/GoalsHighlight";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { getCurrentMonthTotals, getMonthlyChartData } from "@/lib/calculations";
import { TRANSACTION_CREATED_EVENT } from "@/lib/events";
import type { TransactionDto } from "@/type/transaction";
import type { GoalDto } from "@/type/goal";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [goals, setGoals] = useState<GoalDto[]>([]);

  const loadData = useCallback(async () => {
    const [balanceRes, transactionsRes, goalsRes] = await Promise.all([
      getBalance(),
      getTransactions(),
      getGoals(),
    ]);
    setBalance(balanceRes.balance);
    setTransactions(transactionsRes);
    setGoals(goalsRes);
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
            : "Não foi possível carregar os dados.",
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

  useEffect(() => {
    function handleTransactionCreated() {
      loadData();
    }

    window.addEventListener(TRANSACTION_CREATED_EVENT, handleTransactionCreated);
    return () => {
      window.removeEventListener(TRANSACTION_CREATED_EVENT, handleTransactionCreated);
    };
  }, [loadData]);

  if (loading) {
    return <p className="text-sm text-text/60">Carregando...</p>;
  }

  const { income, expense } = getCurrentMonthTotals(transactions);
  const chartData = getMonthlyChartData(transactions);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-0.5 text-2xl font-medium">Dashboard</h1>
        <p className="text-sm text-text/60">Aqui está o resumo do seu mês.</p>
      </div>

      {error && <p className="text-sm text-accent-300">{error}</p>}

      <SummaryCards balance={balance} income={income} expense={expense} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={chartData} />
        </div>
        <GoalsHighlight goals={goals} />
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}
