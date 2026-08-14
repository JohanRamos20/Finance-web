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

export interface LoginResponse {
  user: UserDto;
}
