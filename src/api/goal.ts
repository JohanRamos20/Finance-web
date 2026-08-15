import { request } from "@/api/client";
import type { GoalDto } from "@/type/goal";

export function getGoals(): Promise<GoalDto[]> {
  return request<GoalDto[]>("/users/me/goals");
}
