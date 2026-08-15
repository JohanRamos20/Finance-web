import { request } from "@/api/client";
import type { ContributeResult, CreateGoalPayload, GoalDto } from "@/type/goal";

export function getGoals(): Promise<GoalDto[]> {
  return request<GoalDto[]>("/users/me/goals");
}

export function createGoal(payload: CreateGoalPayload): Promise<GoalDto> {
  return request<GoalDto>("/users/me/goals", {
    method: "POST",
    body: payload,
  });
}

export function contributeToGoal(
  goalId: string,
  amount: number,
): Promise<ContributeResult> {
  return request<ContributeResult>(`/users/me/goals/${goalId}`, {
    method: "PATCH",
    body: { amount },
  });
}

export function deleteGoal(goalId: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/me/goals/${goalId}`, {
    method: "DELETE",
  });
}
