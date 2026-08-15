export interface GoalDto {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
}

export interface CreateGoalPayload {
  name: string;
  description?: string;
  targetAmount: number;
}

export interface ContributeResult {
  goalReached: boolean;
  remainingAmount: number;
}
