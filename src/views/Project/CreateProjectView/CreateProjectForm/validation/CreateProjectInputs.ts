import { User } from "@interfaces/auth";

export type CreateProjectInputs = {
  clientEmail: string;
  title: string;
  description: string;
  budget: number;
  deliveryInDays: number;
  managers: User[];
};

export const initialValues: CreateProjectInputs = {
  clientEmail: "",
  title: "",
  description: "",
  budget: 29,
  deliveryInDays: 1,
  managers: [],
};
