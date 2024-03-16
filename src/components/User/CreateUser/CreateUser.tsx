// Services
import { useCreateUserMutation } from "@services/userApi";

// Mantine
import { TextInput, Button, PasswordInput, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Validation
import { CreateUserValues, initialValues, createUserSchema } from "./createUserValidation";

// Props
type CreateUserProps = {
  isClient?: boolean;
};

export const CreateUser = ({ isClient }: CreateUserProps) => {
  // Mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  // Hooks
  const { verifyRole } = useVerifyRole();

  // Form utils
  const form = useForm<CreateUserValues>({
    initialValues: { ...initialValues, role: isClient ? "client" : initialValues.role },
    validate: zodResolver(createUserSchema),
  });

  const handleSubmit = async (values: CreateUserValues) => {
    try {
      await createUser(values).unwrap();

      showNotification({
        title: "Success",
        message: "User created successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeAllModals();
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput label="Name" placeholder="Name" withAsterisk {...form.getInputProps("name")} />
      <TextInput
        label="E-mail"
        placeholder="E-mail address"
        withAsterisk
        mt="md"
        {...form.getInputProps("email")}
      />
      <PasswordInput
        label="Password"
        placeholder="Password"
        withAsterisk
        mt="md"
        {...form.getInputProps("password")}
      />
      {(verifyRole("admin") && !isClient) || !isClient ? (
        <Select
          label="Role"
          placeholder="Team meber's role"
          withAsterisk
          mt="md"
          data={[
            { label: "Admin", value: "admin" },
            { label: "Manager", value: "manager" },
            { label: "Sales", value: "sales" },
            { label: "Developer", value: "developer" },
          ]}
          {...form.getInputProps("role")}
        />
      ) : null}
      <Button mt="lg" type="submit" loading={isCreating}>
        Create
      </Button>
    </form>
  );
};
