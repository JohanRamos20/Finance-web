import type { LoginCredentials } from "@/type/auth";

type LoginResult = { ok: true } | { ok: false; message: string };

// Sem backend ainda — placeholder até existir um endpoint real de autenticação.
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!credentials.email || !credentials.password) {
    return { ok: false, message: "Preencha e-mail e senha para continuar." };
  }

  return { ok: true };
}
