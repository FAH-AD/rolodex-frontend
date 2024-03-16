import { useEffect, useMemo, useState } from "react";

// Routing
import { Link, useNavigate } from "react-router-dom";

// Redux
import { useReduxDispatch, useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";
import { toggleDrawer, selectIsDrawerOpen } from "@slices/layoutSlice";

// Firebase
import { messaging } from "@lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

// Services
import { useGetProjectsQuery } from "@services/projectApi";
import { useUpdateFcmTokenMutation } from "@services/userApi";

// Mantine
import {
  Box,
  Burger,
  Button,
  Flex,
  Group,
  Indicator,
  Header as MantineHeader,
  MediaQuery,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { hideNotification, showNotification } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { openModal } from "@mantine/modals";

// Components
import { UserButton } from "@components/User/UserButton";

// Icons
import {
  IconCircleCheck,
  IconMenu2,
  IconMessageCircle,
  IconMessages,
  IconNotification,
  IconX,
} from "@tabler/icons";

// Assets
import Logo from "@assets/images/ecomrolodex_dashboard_logo.png";

export const Header = () => {
  const dispatch = useReduxDispatch();
  const user = useReduxSelector(selectUser);
  const isDrawerOpen = useReduxSelector(selectIsDrawerOpen);
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const [isFcmTokenLoading, setIsFcmTokenLoading] = useState(false);

  // Queries
  const { data: { projects = [] } = {}, isLoading } = useGetProjectsQuery();

  // Mutations
  const [updateFcmToken] = useUpdateFcmTokenMutation();

  const unreadMessageCount = useMemo(
    () =>
      projects.reduce((acc, cur) => {
        if (cur.messages.length) {
          const lastMessage = cur.messages[cur.messages.length - 1];
          if (lastMessage.userId !== user?.id) {
            return acc + 1;
          }
        }
        return acc;
      }, 0),
    [projects]
  );

  const [isNavbarExpanded, setIsNavbarExpanded] = useLocalStorage({
    key: "isNavbarExpanded",
    defaultValue: true,
  });

  const handleChatClick = () => {
    if (user?.role !== "client") {
      return navigate("/dashboard/message-center");
    }

    if (!projects.length) {
      return openModal({
        title: "You don't have any projects yet",
        children: (
          <div>
            <Text>
              You don't have any projects yet. You can create a request to start a project and chat
              with team
            </Text>
            <Button component={Link} to="/dashboard/projects/request">
              Create a Request
            </Button>
          </div>
        ),
      });
    }

    const activeProject = projects.find((project) => project.progress === "started");
    const newProject = projects.find((project) => project.progress === "submitted");

    if (activeProject && newProject) {
      return navigate("/dashboard/projects");
    }

    navigate("/dashboard/message-center");
  };

  const handleBurgerClick = () => {
    dispatch(toggleDrawer());
  };

  const requestNotificationPermission = () => {
    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        try {
          // setIsFcmTokenLoading(true);
          showNotification({
            id: "fcm-token-loading",
            title: "Loading",
            message: "Enabling notifications...",
            loading: true,
          });

          const fcmToken = await getToken(messaging, {
            vapidKey:
              "BMx4FtifVXhzcsNB3AqsaX_MyRH5OyhzTNyFl60C9tCnyJnU4EuvGNGNDh43hUCvS84-Qb4dxOwiYeYsct460sw",
          });

          if (fcmToken) {
            await updateFcmToken(fcmToken).unwrap();

            showNotification({
              title: "Success",
              message: "You will now receive notifications about important updates.",
              color: "green",
              icon: <IconCircleCheck />,
            });
          } else {
            console.log("No registration token available. Request permission to generate one.");
          }
        } catch (error) {
          console.log("An error occurred while retrieving token. ", error);
          showNotification({
            title: "Error",
            message: "An error occurred while retrieving notification token.",
            color: "red",
            icon: <IconX />,
          });
        } finally {
          hideNotification("fcm-token-loading");
        }
      } else {
        showNotification({
          title: "Error",
          message: "Unable to get permission to notify. Permission denied by user.",
          color: "red",
          icon: <IconX />,
        });
      }
    });
  };

  useEffect(() => {
    onMessage(messaging, (payload) => {
      showNotification({
        title: payload.notification?.title ?? "New Message",
        message: payload.notification?.body ?? "You have a new message",
        color: "cyan",
        icon: <IconNotification />,
      });
    });
  }, []);

  const hasNotificationPermission = Notification.permission === "granted";

  return (
    <MantineHeader
      height={hasNotificationPermission ? 80 : 120}
      p={hasNotificationPermission ? "md" : 0}
    >
      <Flex direction="column">
        {!hasNotificationPermission && (
          <Flex
            gap="sm"
            align="center"
            justify="center"
            p="xs"
            style={{ backgroundColor: "#7272ee" }}
          >
            <Text color="white" align="center">
              Would you like to receive notifications about important updates?
            </Text>
            <Button
              onClick={requestNotificationPermission}
              variant="white"
              size="xs"
              loading={isFcmTokenLoading}
            >
              Allow Notifications
            </Button>
          </Flex>
        )}
        <Flex
          justify="space-between"
          align="center"
          px={hasNotificationPermission ? 0 : "md"}
          mt={hasNotificationPermission ? 0 : "md"}
        >
          <Group align="center" spacing="xs">
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
              <Button
                variant="subtle"
                color="gray"
                compact
                onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
              >
                <IconMenu2 />
              </Button>
            </MediaQuery>
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Burger
                opened={isDrawerOpen}
                onClick={handleBurgerClick}
                size="sm"
                color={theme.colors.gray[6]}
              />
            </MediaQuery>
            <Link to="/dashboard/projects">
              <img src={Logo} alt="EcomRolodex" height={30} />
            </Link>
          </Group>
          <Group align="center" spacing="xs">
            {!isLoading && (
              <Indicator label={unreadMessageCount.toString()} size={18}>
                <Button variant="light" leftIcon={<IconMessages />} onClick={handleChatClick}>
                  Chat
                </Button>
              </Indicator>
            )}
            <UserButton />
          </Group>
        </Flex>
      </Flex>
    </MantineHeader>
  );
};
