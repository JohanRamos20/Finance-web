"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/api/client";
import { registerUser } from "@/api/user";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name || !email || !password || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await registerUser({ name, email, password });
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar a conta. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-1 text-2xl font-medium">Criar conta</h1>
        <p className="text-sm text-text/60">Leva menos de um minuto</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="reg-name"
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          minLength={3}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="reg-email"
          label="E-mail"
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="reg-pass"
          label="Senha"
          type="password"
          placeholder="••••••••"
          minLength={4}
          maxLength={100}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          id="reg-confirm"
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          minLength={4}
          maxLength={100}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="text-xs text-accent-300">{error}</p>}

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="text-sm text-text/75">
        Já tem conta?{" "}
        <Link href="/login" className="text-accent underline-offset-3 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
