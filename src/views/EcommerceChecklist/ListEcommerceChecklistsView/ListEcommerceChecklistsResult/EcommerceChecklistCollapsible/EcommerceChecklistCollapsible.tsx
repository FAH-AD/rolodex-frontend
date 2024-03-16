import React from "react";

// Services
import { useDeleteEcommerceChecklistMutation } from "@services/ecommerceChecklistApi";

// UI Components
import { ActionIcon, Collapse, Group, LoadingOverlay, Menu, Paper, Text } from "@mantine/core";

// UI Utils
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { openConfirmModal, openModal } from "@mantine/modals";

// Icons
import {
  IconChevronDown,
  IconCircleCheck,
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons";

// Interfaces
import { EcommerceChecklist } from "@interfaces/ecommerceChecklist";
import { EcommerceChecklistItems } from "./EcommerceChecklistItems";

// Lazy Imports
const CreateItem = React.lazy(() =>
  import("@components/EcommerceChecklist/CreateItem").then((module) => ({
    default: module.CreateItem,
  }))
);
const EditChecklist = React.lazy(() =>
  import("@components/EcommerceChecklist/EditChecklist").then((module) => ({
    default: module.EditChecklist,
  }))
);

// Props
type EcommerceChecklistCollapsibleProps = {
  checklist: EcommerceChecklist;
};

export const EcommerceChecklistCollapsible: React.FC<EcommerceChecklistCollapsibleProps> = ({
  checklist,
}) => {
  // Queries
  const [deleteEcommerceChecklist, { isLoading: isDeleting }] =
    useDeleteEcommerceChecklistMutation();

  // State
  const [isCollapsibleOpen, collapsibleHandlers] = useDisclosure(false);

  const handleNewItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      key: "createEcommerceChecklistItem",
      title: "Create Ecommerce Checklist Item",
      children: (
        <React.Suspense fallback={<LoadingOverlay visible />}>
          <CreateItem checklistId={checklist.id} />
        </React.Suspense>
      ),
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      key: "editEcommerceChecklist",
      title: "Edit Ecommerce Checklist",
      children: (
        <React.Suspense fallback={<LoadingOverlay visible />}>
          <EditChecklist checklist={checklist} />
        </React.Suspense>
      ),
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: "Are you sure you want to delete this ecommerce checklist?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteEcommerceChecklist(checklist.id).unwrap();
          showNotification({
            title: "Success",
            message: "Ecommerce checklist deleted successfuly",
            color: "green",
            icon: <IconCircleCheck />,
          });
        } catch {}
      },
    });
  };

  return (
    <>
      <Paper
        withBorder
        p="sm"
        mt="sm"
        onClick={collapsibleHandlers.toggle}
        style={{
          cursor: "pointer",
          backgroundColor: checklist.color,
          color: "#fff",
          position: "relative",
        }}
      >
        <LoadingOverlay visible={isDeleting} />
        <Group noWrap position="apart">
          <Text size="sm">{checklist.name}</Text>
          <Group noWrap spacing="xs">
            <Menu position="bottom-start" width="max-content">
              <Menu.Target>
                <ActionIcon
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  sx={(theme) => ({
                    color: theme.white,
                    "&:hover": {
                      backgroundColor: "rgba(52, 58, 64, 0.2)",
                    },
                  })}
                  variant="subtle"
                >
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleNewItem} icon={<IconPlus size={18} />}>
                  New Item
                </Menu.Item>
                <Menu.Item onClick={handleEdit} icon={<IconEdit size={16} />}>
                  Edit
                </Menu.Item>
                <Menu.Item onClick={handleDelete} color="red" icon={<IconTrash size={16} />}>
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <IconChevronDown
              style={{
                transform: isCollapsibleOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "all .4s",
              }}
            />
          </Group>
        </Group>
      </Paper>
      <Collapse transitionDuration={400} mt={0} in={isCollapsibleOpen}>
        <EcommerceChecklistItems checklist={checklist} />
      </Collapse>
    </>
  );
};
