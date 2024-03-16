import { useEffect, useState } from "react";

// Services
import { useLoginWithGoogleMutation } from "@services/authApi";

// Mantine
import { Group, Button, Divider, LoadingOverlay, Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconLink, IconMail, IconX } from "@tabler/icons";

// Components
import GoogleButton from "@components/SocialButtons/GoogleButton";
import EmailLogin from "./EmailLogin";
import MagicLink from "./MagicLink";

// Google
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";

export const LoginForm = () => {
  const [loginWithGoogle, { isLoading: isGoogleLogingLoading }] = useLoginWithGoogleMutation();

  const [type, setType] = useState<"password" | "magicLink">();
  const [googleUser, setGoogleUser] = useState<TokenResponse>();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setGoogleUser(tokenResponse);
    },
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

  useEffect(() => {
    if (googleUser) {
      loginWithGoogle({ accessToken: googleUser.access_token });
    }
  }, [googleUser]);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={isGoogleLogingLoading} />
      <GoogleButton fullWidth onClick={() => login()} radius="xl">
        Login with Google
      </GoogleButton>
      <Divider label="Or continue with other options" labelPosition="center" my="lg" />
      <Group grow>
        <Button
          leftIcon={<IconMail size={18} />}
          radius="xl"
          variant="default"
          color="gray"
          onClick={() => setType("password")}
        >
          Password
        </Button>
        <Button
          leftIcon={<IconLink size={18} />}
          radius="xl"
          variant="default"
          color="gray"
          onClick={() => setType("magicLink")}
        >
          Magic Link
        </Button>
      </Group>
      {type === "password" && (
        <Box mt="md">
          <EmailLogin />
        </Box>
      )}
      {type === "magicLink" && (
        <Box mt="md">
          <MagicLink />
        </Box>
      )}
    </div>
  );
};
