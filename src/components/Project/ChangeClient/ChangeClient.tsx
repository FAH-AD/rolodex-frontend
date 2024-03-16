import { useMemo } from "react";

// Services
import { useGetUsersByRoleQuery } from "@services/userApi";
import { useUpdateProjectClientMutation } from "@services/projectApi";

// Mantine
import { Button, LoadingOverlay, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { closeModal } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { changeClientSchema, ChangeClientValues } from "./changeClientValidation";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const ChangeClient = ({ project }: Props) => {
  const form = useForm<ChangeClientValues>({
    initialValues: {
      clientId: project.clientId.toString(),
    },
    validate: zodResolver(changeClientSchema),
  });

  const [updateProjectClient, { isLoading: isUpdating }] = useUpdateProjectClientMutation();
  const { data, isLoading, isFetching } = useGetUsersByRoleQuery(["client"]);

  const clientOptions = useMemo(
    () =>
      data?.users.map((user) => ({
        label: user.name,
        value: user.id.toString(),
      })) || [],
    [data]
  );

  const handleSubmit = async (values: ChangeClientValues) => {
    try {
      await updateProjectClient({
        id: project.id,
        clientId: parseInt(values.clientId, 10),
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Client updated successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeModal("changeClient");
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={isLoading || isFetching} />
      <Select
        label="Client"
        placeholder="Please select a client"
        data={clientOptions}
        searchable
        {...form.getInputProps("clientId")}
      />
      <Button type="submit" mt="lg" loading={isUpdating}>
        Update
      </Button>
    </form>
  );
};
