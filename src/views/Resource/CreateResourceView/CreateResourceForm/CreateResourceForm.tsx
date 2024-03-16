import React from "react";

// Routing
import { useNavigate } from "react-router-dom";

// Services
import { useCreateResourceMutation } from "@services/resourceApi";

// UI Components
import { Button, Checkbox, ColorInput, Input, Paper, TextInput } from "@mantine/core";
import { TextEditor } from "@ui/TextEditor";

// UI Utils
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck, IconFileDescription } from "@tabler/icons";

// Validation
import { CreateResourceInputs, initialValues } from "./validation/CreateResourceInputs";
import { createResourceSchema } from "./validation/createResourceSchema";

export const CreateResourceForm = () => {
  const navigate = useNavigate();
  const [createResource, { isLoading }] = useCreateResourceMutation();

  const form = useForm<CreateResourceInputs>({
    initialValues,
    validate: zodResolver(createResourceSchema),
  });

  const onCreateResourceSubmit = async () => {
    try {
      await createResource(form.values).unwrap();
      showNotification({
        title: "Success",
        message: "Resource created successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });
      navigate("/dashboard/resources");
    } catch {}
  };

  return (
    <Paper p="md" withBorder>
      <form onSubmit={form.onSubmit(onCreateResourceSubmit)}>
        <TextInput
          label="Title"
          placeholder="Resource title"
          withAsterisk
          icon={<IconFileDescription size={18} />}
          {...form.getInputProps("title")}
        />
        <Input.Wrapper label="Description" mt="md" withAsterisk>
          <TextEditor placeholder="Resource description" {...form.getInputProps("description")} />
        </Input.Wrapper>
        <ColorInput
          label="Color"
          placeholder="Resource's color"
          mt="md"
          withAsterisk
          {...form.getInputProps("color")}
        />
        <Checkbox label="Private resource" mt="md" {...form.getInputProps("isPrivate")} />
        <Button type="submit" mt="lg" loading={isLoading}>
          Create
        </Button>
      </form>
    </Paper>
  );
};
