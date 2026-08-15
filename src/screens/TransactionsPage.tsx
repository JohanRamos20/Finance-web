"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "@/api/client";
import { getTransactions } from "@/api/transaction";
import { Card } from "@/components/ui/Card";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import {
  TransactionFilters,
  type TransactionTypeFilter,
} from "@/components/transactions/TransactionFilters";
import { CATEGORY_LABELS } from "@/lib/calculations";
import { TRANSACTION_CREATED_EVENT } from "@/lib/events";
import type { TransactionDto } from "@/type/transaction";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");

  const loadData = useCallback(async () => {
    const data = await getTransactions();
    setTransactions(data);
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
            : "Não foi possível carregar as transações.",
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

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((tx) => {
      if (typeFilter !== "all" && tx.transactionType !== typeFilter) {
        return false;
      }
      if (!query) return true;

      const categoryLabel = CATEGORY_LABELS[tx.category].toLowerCase();
      return (
        tx.name.toLowerCase().includes(query) || categoryLabel.includes(query)
      );
    });
  }, [transactions, search, typeFilter]);

  if (loading) {
    return <p className="text-sm text-text/60">Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-0.5 text-2xl font-medium">Transações</h1>
          <p className="text-sm text-text/60">
            Todo o seu histórico, em um só lugar.
          </p>
        </div>

        <TransactionFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </div>

      {error && <p className="text-sm text-accent-300">{error}</p>}

      <Card>
        <TransactionsTable
          transactions={filteredTransactions}
          emptyMessage={
            transactions.length === 0
              ? "Nenhuma transação ainda."
              : "Nenhuma transação encontrada."
          }
        />
      </Card>
    </div>
  );
}
