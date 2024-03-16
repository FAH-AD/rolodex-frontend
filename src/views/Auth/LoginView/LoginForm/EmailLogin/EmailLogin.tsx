// Routing
import { Link } from "react-router-dom";

// Services
import { useLoginMutation } from "@services/authApi";

// Mantine
import { TextInput, PasswordInput, Checkbox, Anchor, Group, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

// Validation
import { EmailLoginValues, emailLoginSchema } from "./emailLoginValidation";

export const EmailLogin = () => {
  // Mutations
  const [login, { isLoading }] = useLoginMutation();

  // Form services
  const form = useForm<EmailLoginValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: zodResolver(emailLoginSchema),
  });

  const handeLoginSubmit = async (inputs: EmailLoginValues) => {
    try {
      await login(inputs).unwrap();
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handeLoginSubmit)}>
      <TextInput
        label="E-mail"
        placeholder="mail@example.com"
        type="email"
        autoComplete="rolodexEmail"
        autoFocus
        withAsterisk
        {...form.getInputProps("email")}
      />
      <PasswordInput
        label="Password"
        placeholder="********"
        mt="md"
        autoComplete="rolodexPassword"
        withAsterisk
        {...form.getInputProps("password")}
      />
      <Group position="apart" mt="md">
        <Checkbox
          label="Remember me"
          checked={form.values.rememberMe}
          onChange={(e) => form.setFieldValue("rememberMe", e.target.checked)}
        />
        <Anchor<"a"> onClick={(event) => event.preventDefault()} href="#" size="sm">
          Forgot password?
        </Anchor>
      </Group>
      <Group position="apart" mt="xl">
        <Anchor component={Link} type="button" color="dimmed" size="xs" to="/register">
          Don't have an account? Register
        </Anchor>
        <Button type="submit" radius="xl" loading={isLoading}>
          Login
        </Button>
      </Group>
    </form>
  );
};
