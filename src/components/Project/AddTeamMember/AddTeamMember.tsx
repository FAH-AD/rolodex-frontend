import { useMemo } from "react";

// Services
import { useGetUsersByRoleQuery } from "@services/userApi";
import { useAddManagerMutation } from "@services/projectManagerApi";

// Mantine
import { Select, Button, LoadingOverlay } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { AddTeamMemberValues, addTeamMemberSchema } from "./addTeamMemberValidation";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const AddTeamMember = ({ project }: Props) => {
  // Mutations
  const [addManager, { isLoading: isAdding }] = useAddManagerMutation();

  // Queries
  const { data, isLoading: isTeamLoading } = useGetUsersByRoleQuery([
    "admin",
    "manager",
    "developer",
    "sales",
  ]);

  // Form utils
  const form = useForm<AddTeamMemberValues>({
    initialValues: {
      userId: "",
    },
    validate: zodResolver(addTeamMemberSchema),
  });

  const handleSubmit = async (values: AddTeamMemberValues) => {
    try {
      await addManager({
        ...values,
        projectId: project.id,
        userId: +values.userId,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Team member added successfully",
        color: "teal",
        icon: <IconCircleCheck />,
      });

      closeAllModals();
    } catch {}
  };

  const teamOptions = useMemo(() => {
    return (
      data?.users
        .filter((user) => {
          return !project.managers.some((manager) => manager.user.id === user.id);
        })
        .map((user) => ({
          label: user.name,
          value: user.id.toString(),
        })) || []
    );
  }, [data, project.managers]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <LoadingOverlay visible={isTeamLoading} />
      <Select
        label="Team member"
        placeholder="Pick a new team member"
        nothingFound="No team members found"
        searchable
        data={teamOptions}
        {...form.getInputProps("userId")}
      />
      <Button type="submit" mt="lg" loading={isAdding}>
        Confirm
      </Button>
    </form>
  );
};
