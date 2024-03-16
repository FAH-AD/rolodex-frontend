import { Suspense, lazy } from "react";

// Services
import { emptyApi } from "@services/emptyApi";

// Redux
import { useReduxDispatch, useReduxSelector } from "@app/hook";
import { loggedOut, selectUser } from "@slices/authSlice";

// UI Components
import {
  Avatar,
  Group,
  UnstyledButton,
  Text,
  createStyles,
  Menu,
  Badge,
  LoadingOverlay,
} from "@mantine/core";

// UI Utils
import { useDisclosure } from "@mantine/hooks";
import { openModal } from "@mantine/modals";

// Icons
import { IconChevronDown, IconLogout } from "@tabler/icons";

// Components
import { ColorSchemeToggler } from "@components/ColorSchemeToggler";

// Lazy Imports
const AddBalance = lazy(() =>
  import("@components/User/AddBalance").then((module) => ({ default: module.AddBalance }))
);

// Styles
const useStyles = createStyles((theme) => ({
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  userActive: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));

export const UserButton = () => {
  const { cx, classes } = useStyles();
  const dispatch = useReduxDispatch();
  const user = useReduxSelector(selectUser);
  const [opened, handlers] = useDisclosure(false);

  const handleAddBalance = () => {
    openModal({
      key: "addBalance",
      title: "Add Balance",
      children: <Suspense fallback={<LoadingOverlay visible />}>{<AddBalance />}</Suspense>,
    });
  };

  const handleLogout = () => {
    dispatch(loggedOut());
    dispatch(emptyApi.util.resetApiState());
  };

  return (
    <div>
      <Menu onClose={handlers.close} onOpen={handlers.open} withArrow position="bottom-end">
        <Menu.Target>
          <UnstyledButton className={cx(classes.user, { [classes.userActive]: opened })}>
            <Group spacing={7}>
              <Avatar src={user?.image} alt={user?.name} radius="xl" size="sm">
                {user?.name.charAt(0).toUpperCase()}
                {user?.name.slice(1).charAt(0).toUpperCase()}
              </Avatar>
              <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                {user?.name}
              </Text>
              <IconChevronDown size={12} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          {user?.role === "client" && (
            <Menu.Item onClick={handleAddBalance}>
              <Group grow spacing="xs">
                <Text>Balance</Text>
                <Badge color="green">${user?.balance}</Badge>
              </Group>
            </Menu.Item>
          )}
          <Menu.Item closeMenuOnClick={false}>
            <Group spacing="xs">
              <Text>Theme</Text>
              <ColorSchemeToggler />
            </Group>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item onClick={handleLogout} icon={<IconLogout size={18} />} color="red">
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
