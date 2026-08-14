import type { ReactNode } from "react";

interface AuthLayoutProps {
  brand: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ brand, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[minmax(240px,1fr)_minmax(340px,1fr)]">
      <div className="hidden items-center justify-center bg-bg md:flex">
        {brand}
      </div>
      <div className="flex items-center justify-center bg-surface p-6">
        <div className="w-full max-w-[340px]">{children}</div>
      </div>
    </div>
  );
}
