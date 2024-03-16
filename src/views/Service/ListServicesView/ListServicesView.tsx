import { useState } from "react";

// Routing
import { Link } from "react-router-dom";

// UI Components
import { Button, Stack } from "@mantine/core";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Icons
import { IconPlus } from "@tabler/icons";

// Components
import Tags from "./Tags";
import ListServicesResult from "./ListServicesResult";
import { PageWrapper } from "@components/PageWrapper";

export const ListServicesView = () => {
  const { verifyRole } = useVerifyRole();

  // State
  const [tag, setTag] = useState<string>("all");

  return (
    <PageWrapper
      title="Services"
      breadcrumbs={[
        {
          label: "Services",
          link: "/dashboard/services",
        },
      ]}
      actions={
        verifyRole("admin", "manager") && (
          <Button component={Link} leftIcon={<IconPlus />} to="/dashboard/services/create">
            New Service
          </Button>
        )
      }
    >
      <Stack mt="md">
        <Tags tag={tag} onTagChange={setTag} />
        <ListServicesResult tag={tag} />
      </Stack>
    </PageWrapper>
  );
};
