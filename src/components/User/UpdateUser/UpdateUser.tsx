// Services
import { useUpdateUserMutation } from "@services/userApi";

// Mantine
import { TextInput, Button, Select, Checkbox } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { UpdateUserValues, updateUserSchema } from "./updateUserValidation";

// Types
import { User } from "@interfaces/auth";

// Props
type Props = {
  user: User;
  isClient?: boolean;
};

export const UpdateUser = ({ user, isClient }: Props) => {
  // Mutations
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Form utils
  const form = useForm<UpdateUserValues>({
    initialValues: user,
    validate: zodResolver(updateUserSchema),
  });

  const handleSubmit = async (values: UpdateUserValues) => {
    try {
      await updateUser({
        ...values,
        id: user.id,
        email: user.email === values.email ? undefined : values.email,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "User updated successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeModal("updateUser");
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
      {!isClient && (
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
      )}
      <Checkbox
        label="Access to private resources"
        mt="md"
        checked={form.values.hasAccessToPrivateResources}
        onChange={(e) => form.setFieldValue("hasAccessToPrivateResources", e.currentTarget.checked)}
      />
      <Button mt="lg" type="submit" loading={isUpdating}>
        Update
      </Button>
    </form>
  );
};
