import { useState } from "react";

// Services
import { useUpdateProfileMutation } from "@services/userApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Components
import {
  Card,
  ActionIcon,
  Alert,
  Avatar,
  Button,
  FileButton,
  Group,
  Input,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

// UI Utils
import { showNotification } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";

// Hooks
import useUploadFileToS3 from "@hooks/aws/useUploadFileToS3";

// Icons
import { IconCircleCheck, IconCloudUpload, IconTrash } from "@tabler/icons";

// Validation
import { UserProfileValues, initialValues, userProfileSchema } from "./userProfileValidation";
import { LoadingOverlay } from '@mantine/core';

import { useGetStoreQuery } from "@services/storeApi";

export const ProfileTab = () => {
  // State
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Mutations
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Hooks
  const { uploadFileToS3, isLoading: isUploadingImage } = useUploadFileToS3();

  // Redux
  const user = useReduxSelector(selectUser);

  const { data: userStores, isLoading: isLoadingStores } = useGetStoreQuery({});

  let stores = null;

  if (isLoadingStores) {
    return (
      <LoadingOverlay visible={isLoadingStores} />
    )
  }
  else {
    stores = userStores.stores;
  }

  // Form
  const form = useForm<UserProfileValues>({
    initialValues: user
      ? {
        ...user,
        phone: user.phone || "",
        stores
      }
      : initialValues,
    validate: zodResolver(userProfileSchema),
  });

  const handleAddStore = () => {
    form.insertListItem("stores", {
      name: null,
      url: "",
    });
  };

  const onSubmit = async (values: UserProfileValues) => {
    try {
      let imageUrl = values.image;
      if (imageFile) {
        const url=await uploadFileToS3(imageFile, imageFile.type, {
          maxSize: 1 * 1024 * 1024,
        });
        imageUrl = url.s3URL;
      }

      await updateProfile({
        ...values,
        phone: values.phone || null,
        image: imageUrl,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });

      setImageFile(null);
    } catch { }
  };

  if (!user) return null;

  const isLoading = isUpdating || isUploadingImage;

  return (
    <Card p="md" withBorder mt="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Group align="center">
          <Avatar src={user.image} size="lg" radius="xl">
            {user.name.charAt(0).toUpperCase() + user.name.charAt(1).toUpperCase()}
          </Avatar>
          <Group align="center" position="center">
            <FileButton onChange={setImageFile} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  {...props}
                  leftIcon={<IconCloudUpload size={18} />}
                  variant="subtle"
                  size="xs"
                >
                  Upload image
                </Button>
              )}
            </FileButton>
            {imageFile && (
              <Text size="sm" align="center">
                Picked file: {imageFile.name}
              </Text>
            )}
          </Group>
        </Group>
        <TextInput
          label="Name"
          placeholder="Full name"
          mt="md"
          withAsterisk
          {...form.getInputProps("name")}
        />
        <TextInput
          label="E-mail"
          mt="md"
          type="email"
          placeholder="E-mail address"
          withAsterisk
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Phone"
          mt="md"
          type="tel"
          placeholder="Phone number (optional)"
          {...form.getInputProps("phone")}
        />
        <Input.Wrapper label="Stores" mt="md">
          {form.values.stores.length ? (
            <Stack spacing="xs">
              {form.values.stores?.map((store, i) => (
                <Group spacing="sm" key={i}>
                  <TextInput
                    value={store.url}
                    placeholder={`e.g. https://store-name.myshopify.com`}
                    error={form.errors[`stores.${i}.url`]}
                    onChange={(e) => form.setFieldValue(`stores.${i}.url`, e.currentTarget.value)}
                    style={{ flexGrow: 1 }}
                  />
                  <ActionIcon
                    color="red"
                    size="sm"
                    onClick={() => form.removeListItem("stores", i)}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          ) : (
            <Alert color="cyan">You don't have any stores registered with your account</Alert>
          )}
        </Input.Wrapper>
        {form.errors.stores && (
          <Alert color="red" mt="sm">
            {form.errors.stores}
          </Alert>
        )}
        {form.values.stores.length < 5 && (
          <Button mt="sm" compact variant="subtle" onClick={handleAddStore}>
            Add store
          </Button>
        )}
        <div>
          <Button type="submit" mt="lg" loading={isLoading}>
            Save Profile
          </Button>
        </div>
      </form>
    </Card>
  );
};
