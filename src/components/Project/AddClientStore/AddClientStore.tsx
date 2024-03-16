// Services
import { projectApi } from "@services/projectApi";
import { useAddClientStoreMutation } from "@services/userApi";

// Redux
import { useReduxDispatch } from "@app/hook";

// Mantine
import { Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { AddClientStoreValues, addClientStoreSchema } from "./addClientStoreValidation";

// Props
type Props = {
  clientId: number;
  projectId?: number;
};

export const AddClientStore = ({ clientId, projectId }: Props) => {
  const dispatch = useReduxDispatch();
  const [addClientStore, { isLoading }] = useAddClientStoreMutation();

  const form = useForm<AddClientStoreValues>({
    initialValues: {
      url: "",
    },
    validate: zodResolver(addClientStoreSchema),
  });

  const handleSubmit = async (values: AddClientStoreValues) => {
    try {
      await addClientStore({ clientId, ...values }).unwrap();

      showNotification({
        title: "Success",
        message: "Client store added successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      if (projectId) {
        dispatch(projectApi.util.invalidateTags([{ type: "Project", id: projectId }]));
      }

      closeModal("addClientStore");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Store URL"
        placeholder="Please enter store url"
        withAsterisk
        {...form.getInputProps("url")}
      />
      <Button mt="lg" type="submit" loading={isLoading}>
        Save
      </Button>
    </form>
  );
};
