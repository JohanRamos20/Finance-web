"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { getStoredUser } from "@/api/session";
import { logout } from "@/api/user";
import {
  DashboardIcon,
  GoalsIcon,
  LogoutIcon,
  TransactionsIcon,
} from "./nav-icons";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: DashboardIcon },
  { href: "/transacoes", label: "Transações", icon: TransactionsIcon },
  { href: "/metas", label: "Metas", icon: GoalsIcon },
] as const;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return getStoredUser();
}

function getServerSnapshot() {
  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 flex w-[232px] flex-col overflow-y-auto border-r border-divider bg-surface p-4 py-6">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <Image
          src="/finance-logo-mark.png"
          alt="Finance"
          width={480}
          height={480}
          className="h-9 w-9"
        />
        <span className="text-[17px] font-medium">Finance</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text hover:bg-text/5",
              )}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-3 border-t border-divider pt-4">
        <div className="px-2 text-[13px] text-text/70">{user?.name}</div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-1 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10"
        >
          <LogoutIcon />
          Sair
        </button>
      </div>
    </aside>
  );
}
