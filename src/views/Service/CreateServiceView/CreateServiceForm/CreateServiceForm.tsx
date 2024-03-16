// Services
import { useCreateServiceMutation } from "@services/serviceApi";

// Routing
import { useNavigate } from "react-router-dom";

// UI Components
import { TextInput, NumberInput, Button, Input, FileInput, Paper } from "@mantine/core";
import { TextEditor } from "@ui/TextEditor";

// UI Utils
import { showNotification } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";

// Hooks
import useUploadFileToS3 from "@hooks/aws/useUploadFileToS3";

// Icons
import {
  IconCircleCheck,
  IconCurrencyDollar,
  IconPhoto,
  IconCalendar,
  IconArrowsSort,
  IconFileDescription,
} from "@tabler/icons";

// Validation
import { CreateServiceValues, initialValues, createServiceSchema } from "./createServiceValidation";

// Components
import { Tags } from "./Tags";

export const CreateServiceForm = () => {
  const navigate = useNavigate();

  // Mutations
  const { uploadFileToS3, isLoading: isUploadingFileToS3 } = useUploadFileToS3();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();

  // Form
  const form = useForm<CreateServiceValues>({
    initialValues,
    validate: zodResolver(createServiceSchema),
  });

  const handleTagsChange = (tags: string[]) => {
    form.setFieldValue("tags", tags);
  };

  const handleCreateServiceSubmit = async (values: CreateServiceValues) => {
    try {
      const image = form.values.image;
      if (!image) return form.setFieldError("image", "Image is required");

      const imageUrl=await uploadFileToS3(image, image.type);

      await createService({
        ...values,
        image: imageUrl.s3URL,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Service created successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });

      navigate("/dashboard/services");
    } catch {}
  };

  const isLoading = isUploadingFileToS3 || isCreating;

  return (
    <Paper p="md" withBorder>
      <form onSubmit={form.onSubmit(handleCreateServiceSubmit)} encType="multipart/form-data">
        <TextInput
          label="Title"
          placeholder="Title"
          type="text"
          mb="md"
          icon={<IconFileDescription size={18} />}
          autoFocus
          required
          {...form.getInputProps("title")}
        />
        <Input.Wrapper label="Description" mt="md" withAsterisk>
          <TextEditor {...form.getInputProps("description")} />
        </Input.Wrapper>
        <FileInput
          label="Image"
          placeholder="Pick an image file"
          accept="image/png,image/jpeg"
          mt="md"
          icon={<IconPhoto size={18} />}
          required
          {...form.getInputProps("image")}
        />
        <NumberInput
          placeholder="e.g. 45"
          label="Cost"
          mt="md"
          icon={<IconCurrencyDollar size={18} />}
          required
          {...form.getInputProps("cost")}
        />
        <NumberInput
          placeholder="e.g. 2"
          label="Delivery in Days"
          mt="md"
          icon={<IconCalendar size={18} />}
          required
          {...form.getInputProps("deliveryInDays")}
        />
        <NumberInput
          label="Order Index"
          mt="md"
          icon={<IconArrowsSort size={18} />}
          required
          {...form.getInputProps("orderIndex")}
        />
        <Input.Wrapper label="Tags" mt="md">
          <Tags value={form.values.tags} onChange={handleTagsChange} />
        </Input.Wrapper>
        <Button type="submit" mt="lg" loading={isLoading}>
          Create
        </Button>
      </form>
    </Paper>
  );
};
