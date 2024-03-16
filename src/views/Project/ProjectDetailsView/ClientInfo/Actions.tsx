import { Suspense, lazy } from "react";

// Mantine
import { Button, LoadingOverlay, Menu } from "@mantine/core";
import { openModal, openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheck } from "@tabler/icons";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Icons
import { IconDots, IconEdit, IconPlus, IconMail } from "@tabler/icons";

import { useSendEmailUpdateMutation } from "@services/userApi";

// Interfaces
import { Project } from "@interfaces/project";

// Lazy Component
const ChangeClient = lazy(() => import("@components/Project/ChangeClient"));
const AddClientStore = lazy(() => import("@components/Project/AddClientStore"));

// Props
type Props = {
  project: Project;
};

export const Actions = ({ project }: Props) => {
  const [sendEmailUpdate, { isLoading: isUpdating }] = useSendEmailUpdateMutation();
  const { verifyRole } = useVerifyRole();

  const sendEmail = () => {
    openConfirmModal({
      title: "Send email update",
      children: "Are you sure you want to send email update?",
      onConfirm: () => {
        sendEmailUpdate({ projectId: project.id }).then(() => {
          showNotification({
            title: "Success",
            message: "Emails sent to client",
            color: "green",
            icon: <IconCircleCheck />,
          });
        })
      },
      labels: { cancel: "Cancel", confirm: "Yes" },
      confirmProps: { color: "blue", loading: isUpdating },
    });
  };

  const handleChangeClient = () => {
    openModal({
      key: "changeClient",
      title: "Change Client",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <ChangeClient project={project} />
        </Suspense>
      ),
    });
  };

  const handleAddClientStore = () => {
    openModal({
      key: "addClientStore",
      title: "Add Store to Client",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <AddClientStore clientId={project.clientId} projectId={project.id} />
        </Suspense>
      ),
    });
  };

  return (
    <Menu
      position="bottom-end"
      withArrow
      styles={{
        item: {
          fontSize: 14,
        },
      }}
    >
      <Menu.Target>
        <Button size="xs" variant="subtle">
          <IconDots />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconMail size={18} />} onClick={sendEmail}>
          Send Email Update
        </Menu.Item>
        <Menu.Item icon={<IconEdit size={18} />} onClick={handleChangeClient}>
          Change client
        </Menu.Item>
        {verifyRole("admin", "manager") && !project.client.stores.length ? (
          <Menu.Item icon={<IconPlus size={18} />} onClick={handleAddClientStore}>
            Add store to client
          </Menu.Item>
        ) : null}
      </Menu.Dropdown>
    </Menu>
  );
};
