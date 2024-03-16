// Routing
import { useNavigate } from "react-router-dom";

// Services
import { useCreateProjectRequestMutation } from "@services/projectApi";

// Mantine
import { Box, Button, Input, NumberInput, Paper, TextInput } from "@mantine/core";
import { TextEditor } from "@ui/TextEditor";
import { showNotification } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";

// Icons
import {
  IconCalendar,
  IconCircleCheck,
  IconCurrencyDollar,
  IconFileDescription,
} from "@tabler/icons";

// Validation
import { CreateRequestInputs, initialValues } from "./validation/CreateRequestInputs";
import { createRequestSchema } from "./validation/createRequestSchema";

export const CreateRequestForm = () => {
  const navigate = useNavigate();
  const [createProjectRequest, { isLoading }] = useCreateProjectRequestMutation();

  const form = useForm<CreateRequestInputs>({
    initialValues,
    validate: zodResolver(createRequestSchema),
  });

  const handleSubmit = async (data: CreateRequestInputs) => {
    try {
      await createProjectRequest(data).unwrap();

      showNotification({
        title: "Success",
        message: "Project request created successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });

      navigate("/dashboard/projects");
    } catch {}
  };

  return (
    <Paper p="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="e.g. Build me a website, Add a custom section to my store"
          icon={<IconFileDescription size={18} />}
          withAsterisk
          {...form.getInputProps("title")}
        />
        <Input.Wrapper
          label="Description"
          mt="md"
          error={<Box mt="sm">{form.errors.description}</Box>}
          withAsterisk
        >
          <TextEditor
            placeholder={`Please enter your request here. Enter as many relevant details as you can. If you have a list of changes you can type in a list (also show examples, links) 1. Change this on the product page 2. Add referral program 3. Add my TrustPilot reviews`}
            {...form.getInputProps("description")}
          />
        </Input.Wrapper>
        <NumberInput
          label="Desired Delivery in Days"
          placeholder="Time to be completed in days"
          mt="md"
          icon={<IconCalendar size={18} />}
          withAsterisk
          {...form.getInputProps("deliveryInDays")}
        />
        <NumberInput
          label="Estimated Budget (optional)"
          placeholder="Budget for request in USD"
          mt="md"
          min={1}
          icon={<IconCurrencyDollar size={18} />}
          {...form.getInputProps("budget")}
        />
        <Button mt="lg" type="submit" loading={isLoading}>
          Send Request
        </Button>
      </form>
    </Paper>
  );
};
