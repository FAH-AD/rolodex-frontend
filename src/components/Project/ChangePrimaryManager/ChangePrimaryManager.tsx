import { useMemo } from "react";

// Services
import { useGetUsersByRoleQuery } from "@services/userApi";
import { useUpdatePrimaryManagerMutation } from "@services/projectManagerApi";

// Mantine
import { Select, Button, LoadingOverlay } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

// Tabler
import { IconCircleCheck } from "@tabler/icons";

// Validation
import {
  ChangePrimaryManagerValues,
  changePrimaryManagerValidationSchema,
} from "./changePrimaryManagerValidation";

// Props
type Props = {
  projectId: number;
};

export const ChangePrimaryManager = ({ projectId }: Props) => {
  // Mutations
  const [updatePrimaryManager, { isLoading: isUpdating }] = useUpdatePrimaryManagerMutation();

  // Queries
  const { data: managers, isLoading: isManagersLoading } = useGetUsersByRoleQuery([
    "admin",
    "manager",
    "sales",
    "developer",
  ]);

  // Form utils
  const form = useForm<ChangePrimaryManagerValues>({
    initialValues: {
      managerId: "",
    },
    validate: zodResolver(changePrimaryManagerValidationSchema),
  });

  const handleSubmit = async (values: ChangePrimaryManagerValues) => {
    try {
      await updatePrimaryManager({
        projectId,
        managerId: +values.managerId,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Primary manager changed successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeAllModals();
    } catch {}
  };

  const managerOptions = useMemo(
    () =>
      managers?.users.map((manager) => ({
        label: manager.name,
        value: manager.id.toString(),
      })) || [],
    [managers]
  );

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={isManagersLoading} />
      <Select
        label="Managers"
        placeholder="Pick a new primary manager"
        data={managerOptions}
        {...form.getInputProps("managerId")}
      />
      <Button type="submit" mt="lg" loading={isUpdating}>
        Confirm
      </Button>
    </form>
  );
};
