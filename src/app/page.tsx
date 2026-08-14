"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/api/client";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return getToken() !== null;
}

function getServerSnapshot() {
  return false;
}

export default function HomePage() {
  const router = useRouter();
  const authenticated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!authenticated) {
      router.replace("/login");
    }
  }, [authenticated, router]);

  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-xl font-semibold">Finance Web</h1>
    </div>
  );
}
