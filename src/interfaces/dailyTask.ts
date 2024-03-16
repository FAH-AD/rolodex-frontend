export interface DailyTaskState {
  startDate: string | null;
  endDate: string | null;
}

export interface DailyTask {
  id: number;
  userId: number;
  name: string;
  status: DailyTaskStatus;
  description: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DailyTaskStatus = "pending" | "in_progress" | "done";
