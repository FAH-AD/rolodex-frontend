// Routing
import { Link } from "react-router-dom";

// UI Components
import { Group, Button } from "@mantine/core";

// Hooks
import { useUpdateProjectProgress } from "@hooks/project/useUpdateProjectProgress";
import { useVerifyRole } from "@hooks/auth/useVerifyRole";

// Interfaces
import { ProjectProgress, ProjectProgressName } from "@interfaces/project";

// Props
type Props = {
  projectId: number;
  progress: ProjectProgressName;
};

export const Actions = ({ projectId, progress }: Props) => {
  const { updateProjectProgress } = useUpdateProjectProgress({ projectId });
  const { verifyRole } = useVerifyRole();

  const handleUpdateProjectStatus = (newStatus: ProjectProgressName, action: string) => () => {
    updateProjectProgress(newStatus, progress, action);
  };

  return (
    <Group>
      <Button component={Link} to={`/dashboard/projects/${projectId}`}>
        Chat with Team
      </Button>
      {verifyRole("admin", "manager") && (
        <>
          {progress === "submitted" && (
            <Button variant="subtle" onClick={handleUpdateProjectStatus("started", "start")}>
              Start
            </Button>
          )}
          {progress === "started" && (
            <Button variant="subtle" onClick={handleUpdateProjectStatus("delivered", "deliver")}>
              Deliver
            </Button>
          )}
        </>
      )}
    </Group>
  );
};
