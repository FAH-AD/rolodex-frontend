import { lazy, ReactNode, useEffect } from "react";

// Routing
import { Outlet } from "react-router-dom";

// Services
import { useUpdateLastOnlineMutation } from "@services/userApi";

// UI Components
import { AppShell, useMantineTheme, createStyles } from "@mantine/core";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";

// Icons
import { IconMessageCircle } from "@tabler/icons";

// Components
import Header from "./Header";
import ExpandedNavbar from "./ExpandedNavbar";
import CollapsedNavbar from "./CollapsedNavbar";

// Lazy Components
const Drawer = lazy(() =>
  import("./Drawer").then((module) => ({
    default: module.Drawer,
  }))
);

// Styles
const useStyles = createStyles((theme) => ({
  main: {
    height: "100%",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[2],
  },
  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[7],
  },
}));

// Props
type DashboardLayoutProps = {
  children?: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const isMediumScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm}px)`
  );
  const [updateLastOnline] = useUpdateLastOnlineMutation();

  const [isNavbarExpanded] = useLocalStorage({
    key: "isNavbarExpanded",
    defaultValue: true,
  });

  useEffect(() => {
    updateLastOnline();
  }, []);

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      padding={16}
      // fixed prop on AppShell will be automatically added to Header and Navbar
      className={classes.main}
      fixed
      navbar={
        isMediumScreen ? (
          <Drawer />
        ) : isNavbarExpanded ? (
          <ExpandedNavbar />
        ) : (
          <CollapsedNavbar />
        )
      }
      header={<Header />}
    >
      {children}
      <Outlet />
    </AppShell>
  );
};
