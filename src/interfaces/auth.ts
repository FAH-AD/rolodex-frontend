import { Project } from "./project";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface User {
  id: number;
  referenceId: string;
  referencedByUserId: number | null;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  password: string;
  role: UserRole;
  balance: number;
  hasAccessToPrivateResources: boolean;
  projects?: Project[];
  stores: Store[];
  referenced_by_user: User | null;
  affiliates: User[];
  lastOnline: string | null;
  lastEmailTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: number;
  userId: number;
  name: string | null;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "admin" | "manager" | "sales" | "developer" | "client";
