// Routing
import { useParams } from "react-router-dom";

// Services
import { useGetResourceByIdQuery, useDeleteResourceMutation } from "@services/resourceApi";

// UI Components
import { ActionIcon, Alert, Box, Loader, Menu, useMantineTheme } from "@mantine/core";

// Components
import { PageWrapper } from "@components/PageWrapper";

// Icons
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";
import { openConfirmModal } from "@mantine/modals";

export const ResourceDetailsView = () => {
  const { id } = useParams();
  const theme = useMantineTheme();
  const { verifyRole } = useVerifyRole();

  // Mutations
  const [deleteResource, { isLoading: isDeleting }] = useDeleteResourceMutation();

  // Queries
  const {
    data: resourceDetails,
    isLoading,
    error,
  } = useGetResourceByIdQuery(parseInt(id!), {
    skip: !id || isNaN(Number(id)),
  });

  const handleDelete = () => {
    openConfirmModal({
      title: "Are you sure you want to delete this resource?",
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteResource(parseInt(id!)).unwrap();
        } catch {}
      },
    });
  };

  if (error) {
    return (
      <Alert color="red">
        There was an error fetching the resource details. Please try again later.
      </Alert>
    );
  }

  return (
    <PageWrapper
      title={resourceDetails?.title || "Resource Details"}
      breadcrumbs={[
        {
          label: "Resources",
          link: "/dashboard/resources",
        },
        {
          label: "Details",
          link: `/dashboard/resources/${id}`,
        },
      ]}
      actions={
        verifyRole("admin") && (
          <Menu position="left-start">
            <Menu.Target>
              <ActionIcon color="violet" variant="filled">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconEdit size={18} />}>Edit</Menu.Item>
              <Menu.Item color="red" icon={<IconTrash size={18} />}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )
      }
    >
      {isLoading && <Loader />}
      {resourceDetails && (
        <Box mt="md">
          <div
            style={{
              color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
            }}
            dangerouslySetInnerHTML={{ __html: resourceDetails.description }}
          />
        </Box>
      )}
    </PageWrapper>
  );
};
