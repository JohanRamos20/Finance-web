"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";
import { deleteGoal } from "@/api/goal";
import type { GoalDto } from "@/type/goal";

interface DeleteGoalDialogProps {
  goal: GoalDto | null;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteGoalDialog({ goal, onClose, onDeleted }: DeleteGoalDialogProps) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setError("");
    onClose();
  }

  async function handleConfirm() {
    if (!goal) return;

    setError("");
    setSubmitting(true);

    try {
      await deleteGoal(goal.id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={goal !== null} onClose={handleClose} title="Excluir meta">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-text/80">
          Tem certeza que deseja excluir a meta &quot;{goal?.name}&quot;? Essa ação
          não pode ser desfeita.
        </p>

        {error && <p className="text-xs text-accent-300">{error}</p>}

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={submitting}
            onClick={handleConfirm}
          >
            {submitting ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
