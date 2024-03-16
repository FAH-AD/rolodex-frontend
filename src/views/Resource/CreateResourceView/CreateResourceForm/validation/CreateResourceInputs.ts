export type CreateResourceInputs = {
  title: string;
  description: string;
  color: string;
  isPrivate: boolean;
};

export const initialValues: CreateResourceInputs = {
  title: "",
  description: "",
  color: "#7272EE",
  isPrivate: false,
};
