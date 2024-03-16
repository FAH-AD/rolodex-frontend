import React from "react";

// UI Components
import { Box } from "@mantine/core";

// Components
import { PageWrapper } from "@components/PageWrapper";
import { CreateRequestForm } from "./CreateRequestForm";

export const CreateRequestView = () => {
  return (
    <PageWrapper
      title="Create a Request"
      breadcrumbs={[
        {
          label: "Projects",
          link: "/dashboard/projects",
        },
        {
          label: "Request",
          link: "/dashboard/projects/request",
        },
      ]}
    >
      <Box mt="md">
        <CreateRequestForm />
      </Box>
    </PageWrapper>
  );
};
