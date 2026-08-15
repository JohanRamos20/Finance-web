"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";
import { createGoal } from "@/api/goal";

interface NewGoalModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewGoalModal({ open, onClose, onCreated }: NewGoalModalProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setTargetAmount("");
    setDescription("");
    setError("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const targetAmountValue = Number(targetAmount);
    if (!name.trim() || !(targetAmountValue > 0)) {
      setError("Preencha o nome e um valor alvo válido.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await createGoal({
        name: name.trim(),
        description: description.trim() || undefined,
        targetAmount: targetAmountValue,
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
    <Modal open={open} onClose={handleClose} title="Nova meta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="Nome da meta"
          placeholder="Ex: Viagem para a praia"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Valor alvo"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <Textarea
          label="Descrição (opcional)"
          placeholder="Ex: Guardar pra viagem de fim de ano"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="text-xs text-accent-300">{error}</p>}

        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Criando..." : "Criar meta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
