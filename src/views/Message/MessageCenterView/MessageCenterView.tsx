import { lazy, Suspense, useState } from "react";

// Services
import { useGetProjectsQuery } from "@services/projectApi";

// UI Components
import { Alert, Button, Card, Grid, LoadingOverlay, Skeleton, Text } from "@mantine/core";

// Components
import { PageWrapper } from "@components/PageWrapper";
import ProjectMessageCard from "./ProjectMessageCard";

// Types
import { Project } from "@interfaces/project";
import { useReduxSelector } from "@app/hook";
import { selectIsClient } from "@slices/authSlice";
import { IconInfoCircle } from "@tabler/icons";
import { Link } from "react-router-dom";

// Lazy Components
const ProjectMessages = lazy(() => import("@components/Project/ProjectMessages"));

export const MessageCenterView = () => {
  const isClient = useReduxSelector(selectIsClient);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: { projects = [] } = {}, isLoading } = useGetProjectsQuery();

  if (!isLoading && isClient && !projects.length) {
    return (
      <PageWrapper
        title="Message Center"
        breadcrumbs={[
          {
            label: "Message Center",
            link: "/dashboard/message-center",
          },
        ]}
      >
        <Alert mt="md" color="blue">
          <Text size="lg" weight={700}>
            Create a Project and Chat with Our Experts within Minutes
          </Text>
        </Alert>
        <Button component={Link} to="/dashboard/projects/request" mt="md">
          Create a Project
        </Button>
      </PageWrapper>
    );
  }

  if (!isLoading && !isClient && !projects.length) {
    return (
      <PageWrapper
        title="Message Center"
        breadcrumbs={[
          {
            label: "Message Center",
            link: "/dashboard/message-center",
          },
        ]}
      >
        <Alert mt="md" color="blue" icon={<IconInfoCircle />}>
          You don't have any projects associated with you
        </Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Message Center"
      breadcrumbs={[
        {
          label: "Message Center",
          link: "/dashboard/message-center",
        },
      ]}
    >
      {isLoading ? (
        <Grid mt="md">
          <Grid.Col p={4} xs={12} lg={3}>
            <Skeleton height={300} />
          </Grid.Col>
          <Grid.Col p={4} xs={12} lg={9}>
            <Skeleton height={300} />
          </Grid.Col>
        </Grid>
      ) : (
        <Grid mt="md">
          <Grid.Col p={4} xs={12} lg={3}>
            {Boolean(projects.length) && (
              <Card p={0} withBorder shadow="sm" style={{ height: 520, overflow: "auto" }}>
                {projects.map((project) => (
                  <ProjectMessageCard
                    key={project.id}
                    project={project}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                  />
                ))}
              </Card>
            )}
          </Grid.Col>
          <Grid.Col p={4} xs={12} lg={9}>
            <Card withBorder shadow="sm" style={{ minHeight: 300 }}>
              {selectedProject ? (
                <Suspense fallback={<LoadingOverlay visible />}>
                  <ProjectMessages project={selectedProject} />
                </Suspense>
              ) : (
                <Text color="dimmed">Select a project to see messages</Text>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      )}
    </PageWrapper>
  );
};
