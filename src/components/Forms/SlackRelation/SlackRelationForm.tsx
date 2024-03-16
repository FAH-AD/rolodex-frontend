// Services
import { useGetUsersByRoleQuery } from "@services/userApi";
import { useCreateSlackRelationMutation } from "@services/slackRelationApi";

// UI Components
import { Button, LoadingOverlay, Select, TextInput } from "@mantine/core";

// UI Utils
import { closeAllModals } from "@mantine/modals";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

// Iconss
import { IconCircleCheck } from "@tabler/icons";

// Validation
import { SlackRelationInputs, initialValues } from "./validation/SlackRelationInputs";
import { slackRelationSchema } from "./validation/slackRelationSchema";

const SlackRelationForm = () => {
  // Queries
  const { data, isLoading: isUsersLoading } = useGetUsersByRoleQuery([
    "admin",
    "manager",
    "sales",
    "developer",
  ]);

  // Mutations
  const [createSlackRelation, { isLoading }] = useCreateSlackRelationMutation();

  // Form
  const form = useForm<SlackRelationInputs>({
    initialValues,
    validate: zodResolver(slackRelationSchema),
  });

  const onSubmit = async (values: SlackRelationInputs) => {
    try {
      await createSlackRelation({
        ...values,
        userId: +values.userId,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Slack relation created successfully.",
        color: "green",
        icon: <IconCircleCheck />,
      });

      closeAllModals();
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <LoadingOverlay visible={isUsersLoading} />
      <Select
        label="User"
        withAsterisk
        data={data?.users.map((user) => ({ label: user.name, value: user.id.toString() })) || []}
        {...form.getInputProps("userId")}
      />
      <TextInput label="Slack ID" withAsterisk mt="md" {...form.getInputProps("slackId")} />
      <Button mt="lg" type="submit" loading={isLoading}>
        Save
      </Button>
    </form>
  );
};

export default SlackRelationForm;
