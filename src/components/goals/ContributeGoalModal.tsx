"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";
import { contributeToGoal } from "@/api/goal";
import type { GoalDto } from "@/type/goal";

interface ContributeGoalModalProps {
  goal: GoalDto | null;
  onClose: () => void;
  onContributed: () => void;
}

export function ContributeGoalModal({
  goal,
  onClose,
  onContributed,
}: ContributeGoalModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setAmount("");
    setError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!goal) return;

    const amountValue = Number(amount);
    if (!(amountValue > 0)) {
      setError("Informe um valor válido.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await contributeToGoal(goal.id, amountValue);
      reset();
      onContributed();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível registrar o aporte. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={goal !== null}
      onClose={handleClose}
      title={goal ? `Aportar em "${goal.name}"` : "Aportar"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="Valor do aporte"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {error && <p className="text-xs text-accent-300">{error}</p>}

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
