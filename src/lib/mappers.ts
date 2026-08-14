import type { AuthenticatedUser, UserDto } from "@/type/user";

export function toSafeUser(user: AuthenticatedUser): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
