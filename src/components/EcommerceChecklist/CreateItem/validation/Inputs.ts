export type Inputs = {
  name: string;
  description: string | null;
  orderIndex: number;
};

export const initialValues: Inputs = {
  name: "",
  description: null,
  orderIndex: 0,
};
