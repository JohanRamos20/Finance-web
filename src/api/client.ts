const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "finance-web:token";

export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  fieldErrors?: ApiFieldError[];

  constructor(status: number, message: string, fieldErrors?: ApiFieldError[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | undefined>;
}

// Normaliza os 3 formatos de erro do back-end (BusinessError, validação Zod,
// erro genérico) numa única mensagem + lista opcional de erros por campo.
async function parseErrorResponse(
  response: Response,
): Promise<{ message: string; fieldErrors?: ApiFieldError[] }> {
  try {
    const data = await response.json();
    const fieldErrors = Array.isArray(data?.errors) ? data.errors : undefined;
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : "Erro inesperado. Tente novamente.";

    return { message, fieldErrors };
  } catch {
    return { message: "Erro inesperado. Tente novamente." };
  }
}

export async function request<T>(
  path: string,
  { method = "GET", body, query }: RequestOptions = {},
): Promise<T> {
  const url = new URL(path, API_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const { message, fieldErrors } = await parseErrorResponse(response);
    throw new ApiError(response.status, message, fieldErrors);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
