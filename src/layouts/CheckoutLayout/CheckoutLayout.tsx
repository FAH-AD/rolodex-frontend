import { ReactNode } from "react";

// Routing
import { Link, Outlet } from "react-router-dom";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// Mantine
import { AppShell, Header, createStyles, Group } from "@mantine/core";

// Components
import { UserButton } from "@components/User/UserButton";

// Assets
import Logo from "@assets/images/ecomrolodex_dashboard_logo.png";

// Styles
const useStyles = createStyles((theme) => ({
  main: {
    height: "100%",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
  },
  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
  },
}));

// Props
type Props = {
  children?: ReactNode;
};

export const CheckoutLayout = ({ children }: Props) => {
  const { classes } = useStyles();
  const user = useReduxSelector(selectUser);

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      padding={16}
      // fixed prop on AppShell will be automatically added to Header and Navbar
      className={classes.main}
      fixed
      header={
        <Header height={70} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              width: "100%",
            }}
          >
            <Group align="center">
              <Link to="/dashboard">
                <img src={Logo} alt="ecomrolodex logo" height={30} />
              </Link>
            </Group>
            {user && <UserButton />}
          </div>
        </Header>
      }
    >
      {children}
      <Outlet />
    </AppShell>
  );
};
