import type { UserDto } from "@/type/user";

const STORED_USER_KEY = "finance-web:user";

// Cache da última leitura: getStoredUser() precisa devolver a MESMA
// referência entre chamadas quando o valor não mudou (é usado como
// getSnapshot do useSyncExternalStore, que exige isso pra não entrar em
// loop de render).
let cachedRaw: string | null = null;
let cachedUser: UserDto | null = null;

// Guarda só dados não-sensíveis (nome/e-mail) para exibição na UI — o token
// de sessão em si vive exclusivamente no cookie httpOnly, nunca aqui.
export function getStoredUser(): UserDto | null {
  if (typeof window === "undefined") return null;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORED_USER_KEY);
  } catch {
    return null;
  }

  if (raw === cachedRaw) return cachedUser;

  cachedRaw = raw;
  try {
    cachedUser = raw ? (JSON.parse(raw) as UserDto) : null;
  } catch {
    cachedUser = null;
  }

  return cachedUser;
}

export function setStoredUser(user: UserDto): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORED_USER_KEY);
}
