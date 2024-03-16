import { lazy, Suspense } from "react";

// UI Components
import { Button, LoadingOverlay } from "@mantine/core";

// UI Utils
import { openModal } from "@mantine/modals";

// Icons
import { IconUserPlus } from "@tabler/icons";

// Components
import { ListClientsResult } from "./ListClientsResult";
import { PageWrapper } from "@components/PageWrapper";

// Lazy Imports
const CreateUser = lazy(() => import("@components/User/CreateUser"));

export const ListClientsView = () => {
  const handleNewClient = () => {
    openModal({
      key: "createUser",
      title: "Create Client",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateUser isClient />
        </Suspense>
      ),
    });
  };

  return (
    <PageWrapper
      title="Clients"
      breadcrumbs={[
        {
          label: "Users",
          link: "/dashboard/users",
        },
        {
          label: "Clients",
          link: "/dashboard/users/clients",
        },
      ]}
      actions={
        <Button leftIcon={<IconUserPlus />} onClick={handleNewClient}>
          New Client
        </Button>
      }
    >
      <ListClientsResult />
    </PageWrapper>
  );
};
