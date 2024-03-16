import { useEffect, useState } from "react";

// Services
import { useCreateProjectRequestMutation } from "@services/projectApi";
import {
  useSendMagicLinkMutation,
  useLoginWithGoogleMutation,
  useRegisterPaswordlessMutation,
} from "@services/authApi";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";

// Mantine
import {
  Paper,
  Title,
  Text,
  TextInput,
  Checkbox,
  Textarea,
  Flex,
  Button,
  Divider,
  LoadingOverlay,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconMail, IconX } from "@tabler/icons";

// Components
import GoogleButton from "@components/SocialButtons/GoogleButton";

// Validation
import {
  NewProjectRequestValues,
  newProjectRequestSchema,
  initialValues,
} from "./newProjectRequestValidation";

export const ProjectForm = () => {
  const [googleUser, setGoogleUser] = useState<TokenResponse>();

  const [registerPaswordless, { isLoading: isRegisterLoading }] = useRegisterPaswordlessMutation();
  const [loginWithGoogle, { isLoading: isGoogleLogingLoading }] = useLoginWithGoogleMutation();
  const [sendMagicLink, { isLoading: isMagicLinkLoading }] = useSendMagicLinkMutation();
  const [createProjectRequest, { isLoading: isProjectRequestLoading }] =
    useCreateProjectRequestMutation();

  const initiateGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => setGoogleUser(tokenResponse),
    onError: (error) => {
      console.log(error);
      showNotification({
        title: "Google login error",
        message: error.error_description || "Something went wrong",
        color: "red",
        icon: <IconX />,
      });
    },
  });

  const form = useForm<NewProjectRequestValues>({
    initialValues,
    validate: zodResolver(newProjectRequestSchema),
  });

  const handleSubmit = async (type: "google" | "email") => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    if (type === "google") {
      initiateGoogleLogin();
      return;
    }

    try {
      const { title, description, storeURL } = form.values;

      await registerPaswordless({
        name: form.values.email,
        email: form.values.email,
      }).unwrap();
      await createProjectRequest({
        title,
        description,
        budget: null,
        needNewStore: form.values.needNewStore,
        signupForm: true,
        storeURL,
        deliveryInDays: 1,
      }).unwrap();
    } catch {}
  };

  const handleSuccessfulGoogleLogin = async (googleUser: TokenResponse) => {
    try {
      const { title, description, storeURL, } = form.values;
      await loginWithGoogle({ accessToken: googleUser.access_token }).unwrap();
      await createProjectRequest({
        title,
        description,
        budget: null,
        needNewStore: form.values.needNewStore,
        signupForm: true,
        storeURL,
        deliveryInDays: 1,
      }).unwrap();
    } catch {}
  };

  useEffect(() => {
    if (googleUser) {
      handleSuccessfulGoogleLogin(googleUser);
    }
  }, [googleUser]);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={
          isProjectRequestLoading ||
          isGoogleLogingLoading ||
          isMagicLinkLoading ||
          isRegisterLoading
        }
      />
      <Title>Need Shopify Help?</Title>
      <Paper withBorder radius="md" p="xl" mt="md">
        <Text size="xl" mb="sm" weight={700}>
          Project Information
        </Text>
        {!form.values.needNewStore && (
          <TextInput
            label="Shopify Store Link"
            placeholder="Please enter your shopify store link"
            type="url"
            withAsterisk
            {...form.getInputProps("storeURL")}
          />
        )}
        <Checkbox
          label="I need a new store"
          mt="sm"
          checked={form.values.needNewStore}
          onChange={(e) => {
            const isChecked = e.currentTarget.checked;
            form.setFieldValue("needNewStore", isChecked);
            if (isChecked) {
              form.setFieldValue("storeURL", "");
            }
          }}
        />
        <Textarea
          label="Description"
          placeholder="Describe the project details and how soon you need this done?"
          mt="md"
          withAsterisk
          {...form.getInputProps("description")}
          onChange={(e) => {
            form.setFieldValue("description", e.currentTarget.value);
            form.setFieldValue("title", e.currentTarget.value.slice(0, 30));
          }}
        />
        <TextInput
          label="Title"
          placeholder="Title"
          mt="md"
          withAsterisk
          {...form.getInputProps("title")}
        />
        <Flex align="center" gap="sm" mt="xl">
          <GoogleButton
            fullWidth
            onClick={() => {
              form.setFieldValue("continueWithEmail", false);
              handleSubmit("google");
            }}
            radius="xl"
            style={{ flexGrow: 1 }}
          >
            Continue with Google
          </GoogleButton>
          <Divider orientation="vertical" />
          <Button
            fullWidth
            leftIcon={<IconMail size={18} />}
            onClick={() => form.setFieldValue("continueWithEmail", !form.values.continueWithEmail)}
            style={{ flexGrow: 1 }}
          >
            Continue with Email
          </Button>
        </Flex>
        {form.values.continueWithEmail && (
          <>
            <TextInput
              label="E-mail"
              placeholder="Please enter your e-mail"
              mt="md"
              withAsterisk
              {...form.getInputProps("email")}
            />
            <Button mt="sm" onClick={() => handleSubmit("email")}>
              Send login link to e-mail
            </Button>
          </>
        )}
      </Paper>
    </div>
  );
};
