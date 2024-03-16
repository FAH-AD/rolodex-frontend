import { useMemo, useState } from "react";

// Services
import { useGetProjectsQuery } from "@services/projectApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectIsClient } from "@slices/authSlice";

// Mantine
import {
  Accordion,
  Affix,
  Alert,
  Anchor,
  Avatar,
  Flex,
  Group,
  Notification,
  Pagination,
  Paper,
  Skeleton,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";

// Icons
import { IconInfoCircle } from "@tabler/icons";

// Components
import ProjectRow from "./ProjectRow";
import { Link } from "react-router-dom";
import { NewProjectRow } from "./NewProjectRow/NewProjectRow";

export const CompactProjectsResult = () => {
  const [page, setPage] = useState(1);
  const isClient = useReduxSelector(selectIsClient);

  const { data, isLoading, isFetching } = useGetProjectsQuery({
    // progresses: ["started", "change_requested"],
    progresses: ["submitted"],
    query: { page },
  });

  const projects = useMemo(() => {
    const copiedProjects = [...(data?.projects || [])];
    const sortedProjects = copiedProjects.sort((a, b) => {
      const priority = ["low", "medium", "high", "urgent"];
      return priority.indexOf(b.priority) - priority.indexOf(a.priority);
    });
    return sortedProjects || [];
  }, [data?.projects]);

  console.log(projects);

  if (isLoading) {
    return <Skeleton mt="md" height={200} />;
  }

  if (!projects.length) {
    return (
      <Alert mt="md" icon={<IconInfoCircle />} color="blue">
        You don't have any <strong>active</strong> projects at the moment
      </Alert>
    );
  }

  const sortIcon = (
    <svg
      style={{ paddingLeft: 7 }}
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#2c3e50"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 9l4 -4l4 4m-4 -4v14" />
      <path d="M21 15l-4 4l-4 -4m4 4v-14" />
    </svg>
  );

  const headingsArray = [
    {
      title: "ID",
      width: "calc(100% / 18)",
      icon: sortIcon,
    },
    {
      title: "Website Name",
      width: "calc(100% / 8)",
      icon: sortIcon,
    },
    {
      title: "Team",
      width: "calc(100% / 10)",
    },
    {
      title: "Progress",
      width: "calc(100% / 9)",
    },
    {
      title: "Deadline",
      width: "calc(100% / 7)",
      icon: sortIcon,
    },
    // ...(!isClient
    //   ? [
    // {
    //   title: "Est. Hours",
    //   width: "calc(100% / 12)",
    // },
    {
      title: "Priority",
      width: "calc(100% / 16)",
      icon: sortIcon,
    },
    {
      title: "Status",
      width: "calc(100% / 10)",
    },
    // ]
    // : []
    // ),
    {
      title: "Last Update",
      width: "calc(100% / 10)",
    },
    {
      title: "Budget",
      width: "calc(100% / 14)",
    },
    {
      title: "Links",
      width: "calc(100% / 12)",
    },
  ];

  return (
    <>
      <Paper
        my={"xl"}
        p={"sm"}
        px={"xl"}
        radius={"md"}
        style={{
          display: "flex",
          justifyContent: "start",
          gap: 10,
        }}
      >
        {headingsArray.map((item, index) => (
          <Text
            key={index}
            size="sm"
            weight={500}
            style={{
              width: `${item.width}`,
            }}
          >
            {item.title}

            {item.icon && item.icon}
          </Text>
        ))}
      </Paper>

      {projects.map((project) => (
        <NewProjectRow key={project.id} project={project} />
      ))}

      {/* <Paper
        withBorder
        p="sm"
        radius="md"
        mt="md"
        style={{ overflowX: "auto" }}
      >
        {isFetching && (
          <Affix position={{ right: 20, bottom: 20 }}>
            <Notification loading title="Refreshing" disallowClose>
              Table is being refreshed, please wait...
            </Notification>
          </Affix>
        )}
        <Table highlightOnHover verticalSpacing="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Team</th>
              <th>Tasks</th>
              {!isClient && <th>Est. Hours</th>}
              <th>Deadline</th>
              {!isClient && <th>Priority</th>}
              <th>Progress</th>
              {!isClient && <th>Status</th>}
              <th>Last Update</th>
              <th>Budget</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </tbody>
        </Table>
      </Paper> */}

      {data?.totalPages && (
        <Group position="center" mt="md">
          <Pagination
            total={data.totalPages}
            page={page}
            onChange={(page) => setPage(page)}
          />
        </Group>
      )}
    </>
  );
};
