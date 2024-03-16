import { useEffect, useMemo, useState } from "react";

// Services
import { useGetProjectsQuery } from "@services/projectApi";

// UI Components
import {
  Affix,
  Alert,
  Group,
  Notification,
  Pagination,
  Skeleton,
  Stack,
} from "@mantine/core";

// Icons
import { IconInfoCircle } from "@tabler/icons";

// Components
import ProjectCard from "./ProjectCard";

// Types
import { ProjectProgressName } from "@interfaces/project";

// Props
type Props = {
  progresses: ProjectProgressName[];
  onLengthChange: (length: number, status: string) => void;
};

export const TabbedProjectsResult = ({ progresses, onLengthChange }: Props) => {
  const [page, setPage] = useState(1);

  // Queries
  const {
    data: { projects = [], totalCount = 0, totalPages = 0 } = {},
    isLoading,
    isFetching,
  } = useGetProjectsQuery({
    progresses,
    query: { page },
  });

  useEffect(() => {
    if (projects) {
      onLengthChange(totalCount, progresses.join(","));
    }
  }, [totalCount]);

  if (isLoading) {
    return <Skeleton height={200} />;
  }

  if (totalCount === 0) {
    return (
      <Alert color="blue" icon={<IconInfoCircle />}>
        No projects found
      </Alert>
    );
  }

  return (
    <>
      <Stack>
        {projects.map((project, i) => (
          <ProjectCard project={project} key={i} />
        ))}
      </Stack>
      <Group position="center" mt="md">
        <Pagination
          total={totalPages}
          page={page}
          onChange={(page) => setPage(page)}
        />
      </Group>
      {isFetching && (
        <Affix position={{ right: 20, bottom: 20 }}>
          <Notification loading title="Refreshing" disallowClose>
            List is being refreshed, please wait...
          </Notification>
        </Affix>
      )}
    </>
  );
};
