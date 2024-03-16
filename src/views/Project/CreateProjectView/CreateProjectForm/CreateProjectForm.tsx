import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Services
import { useCreateProjectMutation } from "@services/projectApi";
import { useGetUsersByRoleQuery } from "@services/userApi";

// UI Components
import {
  TextInput,
  NumberInput,
  Input,
  Button,
  Select,
  Avatar,
  Group,
  Card,
  Text,
  ActionIcon,
  LoadingOverlay,
  Paper,
} from "@mantine/core";
import { TextEditor } from "@ui/TextEditor";

// UI Utils
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

// Icons
import {
  IconCalendar,
  IconCircleCheck,
  IconCurrencyDollar,
  IconFileDescription,
  IconUserCircle,
  IconX,
  IconUsers,
} from "@tabler/icons";

// Validation
import { CreateProjectInputs, initialValues } from "./validation/CreateProjectInputs";
import { createProjectSchema } from "./validation/createProjectSchema";

export const CreateProjectForm = () => {
  const navigate = useNavigate();

  // Queries
  const { data: managersData, isLoading: isManagersLoading } = useGetUsersByRoleQuery([
    "admin",
    "manager",
    "sales",
    "developer",
  ]);
  const { data: clientsData, isLoading: isClientsLoading } = useGetUsersByRoleQuery(["client"]);

  // Mutations
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  const form = useForm<CreateProjectInputs>({
    initialValues,
    validate: zodResolver(createProjectSchema),
  });

  const managers = useMemo(
    () =>
      managersData?.users
        .filter((manager) => !form.values.managers.find((m) => m.id === manager.id))
        .map((manager) => ({
          label: manager.name,
          value: manager.id.toString(),
        })) || [],
    [managersData, form.values.managers.length]
  );

  const clients = useMemo(
    () =>
      clientsData?.users.map((client) => ({
        label: client.email,
        value: client.email,
      })) || [],
    [clientsData]
  );

  const handleManagerSelect = (value: string | null) => {
    if (value) {
      const manager = managersData?.users.find((manager) => manager.id === parseInt(value));
      const managerExists = form.values.managers.find((manager) => manager.id === parseInt(value));
      if (managerExists) return form.setFieldError("managers", "Manager already selected");
      if (manager) {
        form.insertListItem("managers", manager);
        form.setFieldError("managers", null);
      }
    }
  };

  const handleCreateProjectSubmit = async (values: CreateProjectInputs) => {
    try {
      await createProject(values).unwrap();

      showNotification({
        title: "Success",
        message: "Project created successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });

      navigate("/dashboard/projects");
    } catch {}
  };

  return (
    <Paper p="md" withBorder>
      <form onSubmit={form.onSubmit(handleCreateProjectSubmit)}>
        <LoadingOverlay visible={isManagersLoading || isClientsLoading} />
        <Select
          label="Client"
          placeholder="Select a client"
          dropdownComponent="div"
          searchable
          creatable
          icon={<IconUserCircle size={18} />}
          getCreateLabel={(value) => `Create client "${value}"`}
          data={clients}
          {...form.getInputProps("clientEmail")}
          value={form.values.clientEmail}
          onCreate={(value) => {
            clients.push({ label: value, value });
            form.setFieldValue("clientEmail", value);
            return { label: value, value };
          }}
        />
        <TextInput
          label="Title"
          placeholder="Project title"
          mt="md"
          withAsterisk
          icon={<IconFileDescription size={18} />}
          {...form.getInputProps("title")}
        />
        <Input.Wrapper label="Description" mt="md" error={form.errors.description} required>
          <TextEditor placeholder="Project description" {...form.getInputProps("description")} />
        </Input.Wrapper>
        <NumberInput
          label="Budget"
          placeholder="Project budget"
          icon={<IconCurrencyDollar size={18} />}
          min={29}
          mt="md"
          withAsterisk
          {...form.getInputProps("budget")}
        />
        <NumberInput
          label="Delivery in Days"
          placeholder="Project's delivery in days"
          icon={<IconCalendar size={18} />}
          min={1}
          mt="md"
          withAsterisk
          {...form.getInputProps("deliveryInDays")}
        />
        <Select
          label="Managers"
          placeholder="Select managers"
          dropdownComponent="div"
          type="number"
          mt="md"
          nothingFound="No managers found"
          searchable
          icon={<IconUsers size={18} />}
          data={managers}
          error={form.errors.managers}
          onChange={handleManagerSelect}
        />
        {form.values.managers.length > 0 && (
          <Group mt="md">
            {form.values.managers.map((manager, i) => (
              <Card withBorder key={i}>
                <Group>
                  <Avatar src="" radius="xl" size="sm">
                    {manager.name.charAt(0) + manager.name.charAt(1)}
                  </Avatar>
                  <Text color={i === 0 ? "violet" : "dimmed"} size="sm">
                    {manager.name}
                  </Text>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => {
                      form.removeListItem("managers", i);
                    }}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Group>
              </Card>
            ))}
          </Group>
        )}
        <Button mt="lg" type="submit" loading={isCreating}>
          Create
        </Button>
      </form>
    </Paper>
  );
};
