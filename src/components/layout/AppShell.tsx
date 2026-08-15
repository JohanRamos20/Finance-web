"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import { PlusIcon } from "@/components/ui/icons";
import { TRANSACTION_CREATED_EVENT } from "@/lib/events";

export function AppShell({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />
      <div className="ml-[232px] min-h-screen px-6 py-6">{children}</div>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Nova transação"
        className="fixed right-8 bottom-8 flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-surface text-accent shadow-lg transition-colors hover:bg-accent/10"
      >
        <PlusIcon />
      </button>

      <NewTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          window.dispatchEvent(new Event(TRANSACTION_CREATED_EVENT));
        }}
      />
    </div>
  );
}
