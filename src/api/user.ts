import { request } from "@/api/client";
import { clearStoredUser, setStoredUser } from "@/api/session";
import type {
  ChangePasswordPayload,
  LoginCredentials,
  LoginResponse,
  RegisterPayload,
  UserDto,
} from "@/type/user";

export function registerUser(payload: RegisterPayload): Promise<UserDto> {
  return request<UserDto>("/users", { method: "POST", body: payload });
}

export async function login(credentials: LoginCredentials): Promise<UserDto> {
  const { user } = await request<LoginResponse>("/sessions", {
    method: "POST",
    body: credentials,
  });

  // O token não é lido aqui: ele chega via Set-Cookie httpOnly na própria
  // resposta (credentials:"include" em client.ts) e o navegador passa a
  // enviá-lo automaticamente nas próximas requisições. O back-end já
  // devolve o user sem passwordHash, então não precisa de mapeamento aqui.
  // Guardamos o nome/e-mail (não-sensível) pra exibir na UI, já que não há
  // endpoint "quem sou eu" no back-end.
  setStoredUser(user);
  return user;
}

export function changePassword(
  payload: ChangePasswordPayload,
): Promise<{ message: string }> {
  return request<{ message: string }>("/users/me/password", {
    method: "PATCH",
    body: payload,
  });
}

export async function logout(): Promise<{ message: string }> {
  const result = await request<{ message: string }>("/sessions/logout", {
    method: "POST",
  });
  clearStoredUser();
  return result;
}
