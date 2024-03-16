import { User } from "./auth";

export interface SlackRelation {
  id: number;
  userId: number;
  slackId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}
