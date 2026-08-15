"use client";

import clsx from "clsx";
import { SearchIcon } from "@/components/ui/icons";
import type { TransactionType } from "@/type/transaction";

export type TransactionTypeFilter = "all" | TransactionType;

interface FilterOption {
  value: TransactionTypeFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "Todas" },
  { value: "CREDIT", label: "Receitas" },
  { value: "DEBIT", label: "Despesas" },
];

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: TransactionTypeFilter;
  onTypeFilterChange: (value: TransactionTypeFilter) => void;
}

export function TransactionFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-text/50" />
        <input
          type="text"
          placeholder="Buscar transação"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-h-9 w-55 rounded-md border border-divider bg-surface py-1.5 pr-2.5 pl-8 text-sm text-text placeholder:text-text/40 outline-none hover:border-text/45 focus-visible:border-accent"
        />
      </div>

      <div className="inline-flex overflow-hidden rounded-md border border-divider">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onTypeFilterChange(value)}
            className={clsx(
              "px-3 py-1.5 text-sm transition-colors",
              value !== "all" && "border-l border-divider",
              typeFilter === value
                ? "bg-accent/10 text-accent"
                : "text-text hover:bg-text/5",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
