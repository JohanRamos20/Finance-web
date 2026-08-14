export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Formato bruto retornado dentro de POST /sessions — inclui passwordHash.
// Nunca usar diretamente para exibir ou persistir dados; sempre mapear
// para UserDto primeiro (ver lib/mappers.ts).
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  token: string;
}
