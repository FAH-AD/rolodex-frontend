import { Suspense, lazy } from "react";

// Routing
import { Navigate, useParams, useSearchParams, Link } from "react-router-dom";

// Services
import { useGetProjectByIdQuery } from "@services/projectApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";

// Mantine
import {
  Grid,
  Tabs,
  Stack,
  Skeleton,
  Affix,
  Notification,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { openModal } from "@mantine/modals";

// Icons
import { IconPlus } from "@tabler/icons";

// Components
import { PageWrapper } from "@components/PageWrapper";
import DescriptionTab from "./DescriptionTab";
import ProjectInfo from "./ProjectInfo";
import MessagesTab from "./MessagesTab";
import CreateVisualCollab from "src/views/VisualCollab/CreateVisualCollab";
import ClientInfo from "./ClientInfo";
import TasksTab from "./TasksTab";
import Managers from "./Managers";

// Lazy Components
const CreateProjectTask = lazy(() => import("@components/Project/CreateTask"));

export const ProjectDetailsView = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: project,
    isLoading,
    isFetching,
  } = useGetProjectByIdQuery(id ? parseInt(id) : skipToken, {
    selectFromResult: ({ data, ...rest }) => ({ data: data?.project, ...rest }),
  });

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleCreateTask = () => {
    if (!project) return;
    openModal({
      key: "createProjectTask",
      title: "Create Project Task",
      children: (
        <Suspense fallback={<LoadingOverlay visible />}>
          <CreateProjectTask projectId={project?.id} />
        </Suspense>
      ),
    });
  };

  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageWrapper
      title={project?.title || "Project"}
      breadcrumbs={[
        { label: "Projects", link: "/dashboard/projects" },
        {
          label: `#ECOM${id}`,
          link: `/dashboard/projects/${id}`,
        },
      ]}
      actions={
        project && (
          <Button onClick={handleCreateTask} leftIcon={<IconPlus />}>
            Create Task
          </Button>
        )
      }
    >
      {isLoading && (
        <Grid mt="md" gutter="lg">
          <Grid.Col span={8}>
            <Skeleton height={300} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Stack>
              <Skeleton height={150} />
              <Skeleton height={150} />
              <Skeleton height={150} />
            </Stack>
          </Grid.Col>
        </Grid>
      )}
      {!isLoading && project && (
        <Grid mt="md" gutter="lg">
          <Grid.Col xs={12} md={8}>
            <Tabs
              keepMounted={false}
              value={searchParams.get("tab") || "messages"}
              onTabChange={handleTabChange}
            >
              <Tabs.List grow>
                <Tabs.Tab value="messages">Messages</Tabs.Tab>
                <Tabs.Tab value="description">Description</Tabs.Tab>
                <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
                <Tabs.Tab value="visualcollab">VisualCollab</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="messages">
                <MessagesTab project={project} />
              </Tabs.Panel>
              <Tabs.Panel value="description">
                <DescriptionTab project={project} />
              </Tabs.Panel>
              <Tabs.Panel value="tasks">
                <TasksTab projectId={project.id} />
              </Tabs.Panel>
              <Tabs.Panel value="visualcollab">
                <CreateVisualCollab projectId={project.id} />
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
          <Grid.Col xs={12} md={4}>
            <Stack>
              <ProjectInfo project={project} />
              <Managers project={project} />
              <ClientInfo project={project} />
            </Stack>
          </Grid.Col>
        </Grid>
      )}
      {isFetching && (
        <Affix position={{ right: 20, bottom: 20 }}>
          <Notification loading title="Refreshing" disallowClose>
            Project is being refreshed, please wait...
          </Notification>
        </Affix>
      )}
    </PageWrapper>
  );
};
