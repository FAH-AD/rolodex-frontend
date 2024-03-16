export type CreateDailyTaskInputs = {
  name: string;
  description: string | null;
  dueDate: string | null;
};

export const initialValues: CreateDailyTaskInputs = {
  name: "",
  description: null,
  dueDate: null,
};
