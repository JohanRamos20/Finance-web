const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

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
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const { message, fieldErrors } = await parseErrorResponse(response);

    // Sessão ausente/expirada/inválida: o token vive num cookie httpOnly,
    // então o front não tem como inspecioná-lo antes de bater na API. Este
    // módulo não é um componente React (pode ser chamado fora de render/
    // event handlers), então useRouter()/redirect() não se aplicam aqui.
    if (response.status === 401 && typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }

    throw new ApiError(response.status, message, fieldErrors);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
