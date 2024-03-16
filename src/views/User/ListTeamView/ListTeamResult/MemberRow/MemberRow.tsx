import { lazy, Suspense } from "react";

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
import dayjs from "dayjs";

// Lazy Imports
const UpdateUser = lazy(() => import("@components/User/UpdateUser"));

// Props
type Props = {
  member: User;
};

export const MemberRow = ({ member }: Props) => {
  // Mutations
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDeleteUser = () => {
    openConfirmModal({
      title: "Are you sure you want to delete this user?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: isDeleting },
      onConfirm: async () => {
        try {
          await deleteUser(member.id).unwrap();
        } catch {}
      },
    });
  };

  const handleEditUser = () => {
    openModal({
      key: "updateUser",
      title: "Edit Team Member",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <UpdateUser user={member} />
        </Suspense>
      ),
    });
  };

  return (
    <tr>
      <td>{member.id}</td>
      <td>{member.name}</td>
      <td>{member.email}</td>
      <td>{member.role}</td>
      <td>{member.lastOnline ? dayjs(member.lastOnline).format("DD MMM YYYY, hh:mm a") : "-"}</td>
      <td>
        <Group spacing="xs">
          <ActionIcon onClick={handleEditUser}>
            <IconEdit size={18} />
          </ActionIcon>
          <ActionIcon color="red" loading={isDeleting} onClick={handleDeleteUser}>
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  );
};
