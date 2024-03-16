// UI Components
import { Paper, Container, Group, createStyles } from "@mantine/core";

// Components
import { ColorSchemeToggler } from "@components/ColorSchemeToggler";
import RegisterForm from "./RegisterForm";

// Assets
import Logo from "@assets/images/logo.png";

// Styles
const useStyles = createStyles((theme) => ({
  root: {
    borderRadius: 0,
    height: "100vh",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
  },
}));

export const RegisterView = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Container size={420} pt={96}>
        <div style={{ position: "absolute", top: 20, left: 20 }}>
          <ColorSchemeToggler />
        </div>
        <Group align="center" position="center">
          <img src={Logo} alt="logo" width={300} />
        </Group>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <RegisterForm />
        </Paper>
      </Container>
    </div>
  );
};
