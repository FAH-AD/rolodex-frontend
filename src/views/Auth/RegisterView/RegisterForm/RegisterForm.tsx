// Routing
import { Link } from "react-router-dom";

// Services
import { useRegisterMutation } from "@services/authApi";

// Mantine
import { TextInput, PasswordInput, Anchor, Group, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

// Validation
import { RegisterValues, registerSchema } from "./registerValidation";

export const RegisterForm = () => {
  // Mutations
  const [register, { isLoading }] = useRegisterMutation();

  // Form services
  const form = useForm<RegisterValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: zodResolver(registerSchema),
  });

  const handeRegisterSubmit = async (inputs: RegisterValues) => {
    try {
      await register(inputs).unwrap();
    } catch {}
  };

  return (
    <form onSubmit={form.onSubmit(handeRegisterSubmit)}>
      <TextInput
        label="Name"
        placeholder="John Doe"
        autoComplete="rolodexName"
        autoFocus
        withAsterisk
        {...form.getInputProps("name")}
      />
      <TextInput
        label="E-mail"
        placeholder="mail@example.com"
        mt="md"
        type="email"
        autoComplete="rolodexEmail"
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
      <Group position="apart" mt="xl">
        <Anchor component={Link} type="button" color="dimmed" size="xs" to="/">
          Already have an account? Login
        </Anchor>
        <Button type="submit" radius="xl" loading={isLoading}>
          Register
        </Button>
      </Group>
    </form>
  );
};
