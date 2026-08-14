import { clearToken, request, setToken } from "@/api/client";
import { toSafeUser } from "@/lib/mappers";
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
  const { user, token } = await request<LoginResponse>("/sessions", {
    method: "POST",
    body: credentials,
  });

  setToken(token);
  return toSafeUser(user);
}

export function changePassword(
  payload: ChangePasswordPayload,
): Promise<{ message: string }> {
  return request<{ message: string }>("/users/me/password", {
    method: "PATCH",
    body: payload,
  });
}

export function logout(): void {
  clearToken();
}
