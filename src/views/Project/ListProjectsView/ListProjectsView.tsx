import { Suspense, lazy, useState } from "react";

// Routing
import { Link, useSearchParams } from "react-router-dom";

// Mantine
import {
  Badge,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Skeleton,
  Tabs,
  Text,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

// Hooks
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Icons
import { IconPlus } from "@tabler/icons";

// Components
import { PageWrapper } from "@components/PageWrapper";

// Date utils
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Types
import { ProjectProgressName } from "@interfaces/project";
import BulletPoint from "./BulletPoint";
import { useGetProjectsQuery } from "@services/projectApi";

dayjs.extend(relativeTime);

// Lazy Components
const CompactProjectsResult = lazy(() => import("./CompactProjectsResult"));
const TabbedProjectsResult = lazy(() => import("./TabbedProjectsResult"));

const tabs: { label: string; value: ProjectProgressName[] }[] = [
  { label: "New Requests", value: ["submitted"] },
  { label: "Active", value: ["started", "change_requested"] },
  { label: "Completed", value: ["completed", "delivered"] },
  { label: "Archived", value: ["archived"] },
  { label: "Follow Upped", value: ["follow_upped"] },
];

export const ListProjectsView = () => {
  const { verifyRole } = useVerifyRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useLocalStorage({
    key: "projects-layout",
    defaultValue: "list",
  });
  const [badgeContents, setBadgeContents] = useState<{ [key: string]: number }>(
    {
      submitted: 0,
      "started,change_requested": 0,
      "completed,delivered": 0,
      archived: 0,
      follow_upped: 0,
    }
  );

  const handleTabChange = (progress: string) => {
    setSearchParams({ progress });
  };

  const handleToggleLayout = () => {
    setLayout(layout === "list" ? "compact" : "list");
  };

  const handleLengthChange = (length: number, status: string) => {
    setBadgeContents((prev) => ({ ...prev, [status]: length }));
  };

  const { data } = useGetProjectsQuery({
    // progresses: ["started", "change_requested"],
    progresses: ["submitted"],
  });

  // console.log("projects :", data?.projects);

  const statusCounts = {
    Requested: 0,
    Active: 0,
    Completed: 0,
    Archived: 0,
    Followup: 0,
  };

  data?.projects.forEach((project) => {
    switch (project.progress) {
      case "submitted":
        statusCounts.Requested++;
        break;
      case "started":
      case "change_requested":
        statusCounts.Active++;
        break;
      case "completed":
      case "delivered":
        statusCounts.Completed++;
        break;
      case "archived":
        statusCounts.Archived++;
        break;
      case "follow_upped":
        statusCounts.Followup++;
        break;
      default:
        break;
    }
  });

  const statusOfProjects = [
    {
      progress: "Requested",
      noOfItems: statusCounts.Requested,
      bulletColor: "#65389B",
    },
    {
      progress: "Active",
      noOfItems: statusCounts.Active,
      bulletColor: "#FAC95B",
    },
    {
      progress: "Completed",
      noOfItems: statusCounts.Completed,
      bulletColor: "#84D881",
    },
    {
      progress: "Archived",
      noOfItems: statusCounts.Archived,
      bulletColor: "#101115",
    },
    {
      progress: "Followup",
      noOfItems: statusCounts.Followup,
      bulletColor: "#CE1B91",
    },
  ];

  // console.log(statusOfProjects);

  return (
    <PageWrapper
      title="Projects"
      breadcrumbs={[
        {
          label: "Projects",
          link: "/dashboard/projects",
        },
      ]}
      actions={
        <Group
          style={{
            width: "88%",
            justifyContent: "space-between",
          }}
        >
          <Container
            style={{
              width: "100%",
              padding: 0,
              margin: 0,
            }}
          >
            {verifyRole("admin", "manager") && (
              <Button
                component={Link}
                leftIcon={<IconPlus />}
                to="/dashboard/projects/create"
              >
                New Project
              </Button>
            )}
            <Flex
              direction="row"
              justify="flex-start"
              align="flex-start"
              wrap="wrap"
              gap={"md"}
              style={{ paddingTop: 10 }}
            >
              {statusOfProjects.map((projectItem, index) => (
                <Paper
                  key={index}
                  style={{
                    backgroundColor: "inherit",
                    gap: 5,
                    borderRadius: 0,
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <BulletPoint color={projectItem.bulletColor} />
                  <Text size="sm" color="#5A5A5A">
                    {projectItem.progress}
                  </Text>
                  <Text size="sm" color="#5A5A5A">
                    {projectItem.noOfItems}
                  </Text>
                </Paper>
              ))}
            </Flex>
          </Container>
          <Button onClick={handleToggleLayout} variant="light">
            {layout === "list" ? "Active View" : "List View"}
          </Button>
        </Group>
      }
    >
      <Suspense fallback={<Skeleton mt="md" height={300} />}>
        {layout === "list" ? (
          <Tabs
            value={searchParams.get("progress") || "submitted"}
            onTabChange={handleTabChange}
            mt="md"
          >
            <Tabs.List grow>
              {tabs.map((tab, i) => (
                <Tabs.Tab value={tab.value.join(",")} key={i}>
                  {tab.label}
                  <Badge ml="sm">{badgeContents[tab.value.join(",")]}</Badge>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {tabs.map((tab, i) => (
              <Tabs.Panel mt="md" value={tab.value.join(",")} key={i}>
                <TabbedProjectsResult
                  progresses={tab.value}
                  onLengthChange={handleLengthChange}
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        ) : (
          <CompactProjectsResult />
        )}
      </Suspense>
    </PageWrapper>
  );
};
