// UI Components
import { Box } from "@mantine/core";

// Components
import { CreateProjectForm } from "./CreateProjectForm";
import { PageWrapper } from "@components/PageWrapper";

export const CreateProjectView = () => {
  return (
    <PageWrapper
      title="New Project"
      breadcrumbs={[
        {
          label: "Projects",
          link: "/dashboard/projects",
        },
        {
          label: "Create",
          link: "/dashboard/projects/create",
        },
      ]}
    >
      <Box mt="md">
        <CreateProjectForm />
      </Box>
    </PageWrapper>
  );
};
