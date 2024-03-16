import { User } from "./auth";

export interface Project {
  id: number;
  clientId: number;
  title: string;
  description: string;
  budget: number | null;
  deliveryInDays: number;
  estimatedDeliveryDate: string;
  estimatedHours: number | null;
  status?: ProjectStatus;
  isClientCreated: boolean;
  progress: ProjectProgressName;
  priority: ProjectPriority;
  client: User;
  managers: ProjectManager[];
  progresses: ProjectProgress[];
  offer: ProjectOffer | null;
  messages: ProjectMessage[];
  tasks: ProjectTask[];
  links: ProjectLink[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectManager {
  user: User;
  isPrimary: boolean;
}

export interface ProjectProgress {
  id: number;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStatus {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMessage {
  id: number;
  projectId: number;
  userId: number;
  message: string;
  user: User;
  type: "text" | "offer" | "attachement";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: ProjectTaskStatus;
  visibility: ProjectTaskVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectOffer {
  id: number;
  projectId: number;
  amount: number;
  deliveryInDays: number;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectLink {
  id: number;
  projectId: number;
  name: string;
  url: string;
  type: ProjectLinkType;
  createdAt: string;
  updatedAt: string;
}

export type ProjectPriority = "low" | "normal" | "high" | "urgent";
export type ProjectLinkType = "googleDrive" | "figma" | "other";
export type ProjectTaskStatus = "todo" | "done";
export type ProjectTaskVisibility = "visible" | "hidden";
export type ProjectProgressName =
  | "submitted"
  | "started"
  | "change_requested"
  | "completed"
  | "delivered"
  | "follow_upped"
  | "archived";
