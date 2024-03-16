import React from "react";

// Services
import {
  useGetEcommerceChecklistItemsQuery,
  useDeleteEcommerceChecklistItemMutation,
} from "@services/ecommerceChecklistApi";

// UI Components
import { ActionIcon, Group, LoadingOverlay, Menu, Paper, Text } from "@mantine/core";

// UI Utils
import { openConfirmModal, openModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCircleCheck, IconDots, IconEdit, IconTrash } from "@tabler/icons";

// Interfaces
import { EcommerceChecklist, EcommerceChecklistItem } from "@interfaces/ecommerceChecklist";

// Lazy Imports
const EditItem = React.lazy(() =>
  import("@components/EcommerceChecklist/EditItem").then((module) => ({ default: module.EditItem }))
);

// Props
type EcommerceChecklistItemsProps = {
  checklist: EcommerceChecklist;
};

export const EcommerceChecklistItems: React.FC<EcommerceChecklistItemsProps> = ({ checklist }) => {
  const [deleteEcommerceChecklistItem, { isLoading: isDeleting }] =
    useDeleteEcommerceChecklistItemMutation();
  const { data: items, isLoading } = useGetEcommerceChecklistItemsQuery(checklist.id);

  const handleEdit = (item: EcommerceChecklistItem) => () => {
    openModal({
      key: "editEcommerceChecklistItem",
      title: "Edit Item",
      children: (
        <React.Suspense fallback={<LoadingOverlay visible />}>
          <EditItem item={item} />
        </React.Suspense>
      ),
    });
  };

  const handleDelete = (item: EcommerceChecklistItem) => () => {
    openConfirmModal({
      title: "Are you sure you want to delete this item?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteEcommerceChecklistItem(item.id).unwrap();
          showNotification({
            title: "Success",
            message: "Item deleted successfully",
            color: "green",
            icon: <IconCircleCheck />,
          });
        } catch {}
      },
    });
  };

  return (
    <Paper withBorder p="sm" style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading || isDeleting} />
      {items && items.length === 0 ? (
        <Text color="dimmed" size="sm">
          No items found for this checklist
        </Text>
      ) : null}
      {items && items.length > 0 ? (
        <>
          {items?.map((item, i) => (
            <Group position="apart" key={i}>
              <Text dangerouslySetInnerHTML={{ __html: item.name }} />
              <Group spacing="xs">
                <Menu>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={handleEdit(item)} icon={<IconEdit size={16} />}>
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      onClick={handleDelete(item)}
                      color="red"
                      icon={<IconTrash size={16} />}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          ))}
        </>
      ) : null}
    </Paper>
  );
};
