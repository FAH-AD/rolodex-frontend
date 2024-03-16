// Routing
import { Link } from "react-router-dom";

// UI Components
import { Button, Box } from "@mantine/core";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Icons
import { IconPlus } from "@tabler/icons";

// Components
import { PageWrapper } from "@components/PageWrapper";
import { ListResourcesResult } from "./ListResourcesResult";

export const ListResourcesView = () => {
  const { verifyRole } = useVerifyRole();

  return (
    <PageWrapper
      title="Resources"
      breadcrumbs={[{ label: "Resources", link: "/dashboard/resources" }]}
      actions={
        verifyRole("admin") && (
          <Button component={Link} leftIcon={<IconPlus />} to="/dashboard/resources/create">
            New Resource
          </Button>
        )
      }
    >
      <Box mt="md">
        <ListResourcesResult />
      </Box>
    </PageWrapper>
  );
};
