import { lazy, Suspense } from "react";

// UI Components
import { Button, LoadingOverlay } from "@mantine/core";

// UI Utils
import { openModal } from "@mantine/modals";

// Icons
import { IconUserPlus } from "@tabler/icons";

// Components
import { ListTeamResult } from "./ListTeamResult";
import { PageWrapper } from "@components/PageWrapper";

// Lazy Imports
const CreateUser = lazy(() => import("@components/User/CreateUser"));

export const ListTeamView = () => {
  const handleNewTeamMember = () => {
    openModal({
      key: "createUser",
      title: "Create Team Member",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateUser />
        </Suspense>
      ),
    });
  };

  return (
    <PageWrapper
      title="Team"
      breadcrumbs={[
        {
          label: "Users",
          link: "/dashboard/users",
        },
        {
          label: "Team",
          link: "/dashboard/users/team",
        },
      ]}
      actions={
        <Button leftIcon={<IconUserPlus />} onClick={handleNewTeamMember}>
          New Team Member
        </Button>
      }
    >
      <ListTeamResult />
    </PageWrapper>
  );
};
