// Services
import { useSendMagicLinkMutation } from "@services/authApi";

// Mantine
import { Alert, Button, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

// Icons
import { IconCheck } from "@tabler/icons";

// Validation
import { MagicLinkValues, magicLinkSchema } from "./magicLinkValidation";

export const MagicLink = () => {
  // Mutations
  const [sendMagicLink, { isLoading, isSuccess }] = useSendMagicLinkMutation();

  // Form services
  const form = useForm<MagicLinkValues>({
    initialValues: {
      email: "",
    },
    validate: zodResolver(magicLinkSchema),
  });

  const handeMagicLinkSubmit = async (values: MagicLinkValues) => {
    try {
      await sendMagicLink(values).unwrap();
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handeMagicLinkSubmit)}>
      {isSuccess ? (
        <Alert color="green" icon={<IconCheck />}>
          Magic link sent, please check your inbox
        </Alert>
      ) : (
        <>
          <TextInput
            label="E-mail"
            placeholder="mail@example.com"
            type="email"
            autoComplete="rolodexEmail"
            autoFocus
            withAsterisk
            {...form.getInputProps("email")}
          />
          <Button type="submit" mt="lg" fullWidth loading={isLoading}>
            Send me Magic Link
          </Button>
        </>
      )}
    </form>
  );
};
