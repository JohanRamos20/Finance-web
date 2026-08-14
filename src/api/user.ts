import { request } from "@/api/client";
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

export function logout(): Promise<{ message: string }> {
  return request<{ message: string }>("/sessions/logout", { method: "POST" });
}
