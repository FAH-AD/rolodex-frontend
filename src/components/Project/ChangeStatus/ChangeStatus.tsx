import { useMemo } from "react";

// Services
import { useUpdateProjectStatusMutation } from "@services/projectApi";
import { useGetProjectStatusesQuery } from "@services/projectStatusApi";

// Mantine
import { Button, LoadingOverlay, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { closeAllModals } from "@mantine/modals";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { ChangeStatusValues, changeStatusSchema } from "./changeStatusValidation";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const ChangeStatus = ({ project }: Props) => {
  const [updateProjectStatus, { isLoading: isUpdating }] = useUpdateProjectStatusMutation();
  const { data: statuses, isLoading } = useGetProjectStatusesQuery();

  const form = useForm<ChangeStatusValues>({
    initialValues: {
      id: project.status?.id.toString() || "",
    },
    validate: zodResolver(changeStatusSchema),
  });

  const handleSubmit = async (values: ChangeStatusValues) => {
    try {
      await updateProjectStatus({
        projectId: project.id,
        statusId: parseInt(values.id),
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Project status has been updated",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeAllModals();
    } catch {}
  };

  const statusOptions = useMemo(
    () =>
      statuses?.map((status) => ({
        label: status.name,
        value: status.id.toString(),
      })) || [],
    [statuses]
  );

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={isLoading || isUpdating} />
      <Select label="Status" data={statusOptions} searchable {...form.getInputProps("id")} />
      <Button type="submit" mt="lg">
        Save
      </Button>
    </form>
  );
};
