import React from "react";

// UI Components
import { Box, Button } from "@mantine/core";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Icons
import { IconPlus } from "@tabler/icons";

// Components
import { PageWrapper } from "@components/PageWrapper";
import { ListEcommerceChecklistsResult } from "./ListEcommerceChecklistsResult";
import { Link } from "react-router-dom";

export const ListEcommerceChecklistsView = () => {
  const { verifyRole } = useVerifyRole();

  return (
    <PageWrapper
      title="Ecommerce Checklist"
      breadcrumbs={[
        {
          label: "Ecommerce Checklist",
          link: "/dashboard/ecommerce-checklists",
        },
      ]}
      actions={
        verifyRole("admin") && (
          <Button
            component={Link}
            to="/dashboard/ecommerce-checklists/create"
            leftIcon={<IconPlus />}
          >
            New Checklist
          </Button>
        )
      }
    >
      <Box mt="md">
        <ListEcommerceChecklistsResult />
      </Box>
    </PageWrapper>
  );
};
