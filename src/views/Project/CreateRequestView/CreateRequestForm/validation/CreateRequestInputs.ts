export type CreateRequestInputs = {
  title: string;
  description: string;
  budget: number | null;
  storeURL: string;
  needNewStore: boolean;
  signupForm: boolean;
  deliveryInDays: number;
};

export const initialValues: CreateRequestInputs = {
  title: "",
  description: "",
  budget: null,
  storeURL: "",
  needNewStore: false,
  signupForm: false,
  deliveryInDays: 3,
};
