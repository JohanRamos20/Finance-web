"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";
import { createTransaction } from "@/api/transaction";
import { CATEGORY_LABELS } from "@/lib/calculations";
import type { Category, TransactionType } from "@/type/transaction";

interface NewTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [Category, string][];
const DEFAULT_CATEGORY: Category = "FOOD";

export function NewTransactionModal({
  open,
  onClose,
  onCreated,
}: NewTransactionModalProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<TransactionType>("DEBIT");
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setAmount("");
    setTransactionType("DEBIT");
    setCategory(DEFAULT_CATEGORY);
    setError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const amountValue = Number(amount);
    if (!name.trim() || !(amountValue > 0)) {
      setError("Preencha a descrição e um valor válido.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await createTransaction({
        name: name.trim(),
        amount: amountValue,
        category,
        transactionType,
      });
      reset();
      onCreated();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Nova transação">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="Descrição"
          placeholder="Ex: Supermercado"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Valor"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Select
            label="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-text/70">Tipo</span>
          <div className="inline-flex overflow-hidden rounded-md border border-divider">
            <button
              type="button"
              onClick={() => setTransactionType("DEBIT")}
              className={clsx(
                "flex-1 py-1.5 text-sm transition-colors",
                transactionType === "DEBIT"
                  ? "bg-accent/10 text-accent"
                  : "text-text hover:bg-text/5",
              )}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setTransactionType("CREDIT")}
              className={clsx(
                "flex-1 border-l border-divider py-1.5 text-sm transition-colors",
                transactionType === "CREDIT"
                  ? "bg-accent/10 text-accent"
                  : "text-text hover:bg-text/5",
              )}
            >
              Receita
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-accent-300">{error}</p>}

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
