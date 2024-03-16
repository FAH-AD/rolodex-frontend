import { useMemo } from "react";

// UI Components
import { Text, Progress } from "@mantine/core";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

export const TaskProgress = ({ project }: Props) => {
  const projectProgress = useMemo(() => {
    const allTasks = project.tasks.length;
    const doneTasks = project.tasks.filter((t) => t.status === "done").length;
    const percentage = (doneTasks / allTasks) * 100;

    return {
      percentage,
      count: `${doneTasks}/${allTasks}`,
    };
  }, [project.tasks]);

  return (
    <>
      <Text size="sm">Task Progress: {projectProgress.count}</Text>
      <Progress value={projectProgress.percentage} />
    </>
  );
};
