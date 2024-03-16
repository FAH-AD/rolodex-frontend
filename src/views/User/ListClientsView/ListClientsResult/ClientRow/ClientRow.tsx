import { lazy, Suspense } from "react";
import dayjs from "dayjs";

// Services
import { useDeleteUserMutation } from "@services/userApi";

// UI Components
import { ActionIcon, Group, LoadingOverlay } from "@mantine/core";

// UI Utils
import { openConfirmModal, openModal } from "@mantine/modals";

// Icons
import { IconEdit, IconTrash } from "@tabler/icons";

// Interfaces
import { User } from "@interfaces/auth";

// Lazy Imports
const UpdateUser = lazy(() => import("@components/User/UpdateUser"));

// Props
type Props = {
  client: User;
};

export const ClientRow = ({ client }: Props) => {
  // Mutations
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDeleteUser = () => {
    openConfirmModal({
      title: "Are you sure you want to delete this user?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteUser(client.id).unwrap();
        } catch {}
      },
    });
  };

  const handleEditUser = () => {
    openModal({
      key: "updateUser",
      title: "Edit Client",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <UpdateUser user={client} isClient />
        </Suspense>
      ),
    });
  };

  return (
    <tr>
      <td>{client.id}</td>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{dayjs(client.createdAt).format("DD MMM YYYY")}</td>
      <td>{dayjs(client.projects?.at(0)?.createdAt).format("DD MMM YYYY") || "-"}</td>
      <td>{client.projects?.length || 0}</td>
      <td>
        $
        {client.projects?.reduce((acc, project) => {
          return acc + (project.budget || 0);
        }, 0) || 0}
      </td>
      <td>
        <Group spacing="xs">
          <ActionIcon onClick={handleEditUser}>
            <IconEdit size={18} />
          </ActionIcon>
          <ActionIcon color="red" onClick={handleDeleteUser} loading={isDeleting}>
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  );
};
