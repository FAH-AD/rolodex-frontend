// UI Components
import { Box } from "@mantine/core";

// Components
import { CreateResourceForm } from "./CreateResourceForm";
import { PageWrapper } from "@components/PageWrapper";

export const CreateResourceView = () => {
  return (
    <PageWrapper
      title="New Resource"
      breadcrumbs={[
        {
          label: "Resources",
          link: "/dashboard/resources",
        },
        {
          label: "Create",
          link: "/dashboard/resources/create",
        },
      ]}
    >
      <Box mt="md">
        <CreateResourceForm />
      </Box>
    </PageWrapper>
  );
};
