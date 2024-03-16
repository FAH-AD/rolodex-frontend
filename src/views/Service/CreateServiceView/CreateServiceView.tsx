import React from "react";

// UI Components
import { Box } from "@mantine/core";

// Components
import { CreateServiceForm } from "./CreateServiceForm";
import { PageWrapper } from "@components/PageWrapper";

export const CreateServiceView = () => {
  return (
    <PageWrapper
      title="New Service"
      breadcrumbs={[
        {
          label: "Services",
          link: "/dashboard/services",
        },
        {
          label: "Create",
          link: "/dashboard/services/create",
        },
      ]}
    >
      <Box mt="md">
        <CreateServiceForm />
      </Box>
    </PageWrapper>
  );
};
