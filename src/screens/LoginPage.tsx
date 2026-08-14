import Image from "next/image";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      brand={
        <div>
          <Image
            src="/finance-logo-full.png"
            alt="Finance"
            width={1086}
            height={453}
            priority
            className="h-auto w-64"
          />
          <div className="my-3 h-0.5 w-auto bg-accent" />
          <div className="text-[13px] text-text/55">
            Seu gestor de finanças.
          </div>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
