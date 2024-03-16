import { Suspense, lazy, useState } from "react";

// Services
import { useUpdateProjectDescriptionMutation } from "@services/projectApi";

// Mantine
import { Button, Group, Paper, Skeleton } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

// Icons
import { IconCheck, IconCircleCheck, IconEdit, IconX } from "@tabler/icons";

// Interfaces
import { Project } from "@interfaces/project";

// Props
type Props = {
  project: Project;
};

// Lazy Components
const TextEditor = lazy(() =>
  import("@ui/TextEditor").then((module) => ({ default: module.TextEditor }))
);

export const DescriptionTab = ({ project }: Props) => {
  const [updateProjectDescription, { isLoading }] = useUpdateProjectDescriptionMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(project.description);

  const handleSave = async () => {
    try {
      await updateProjectDescription({
        id: project.id,
        description: editedDescription,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Project description updated successfully",
        color: "green",
        icon: <IconCircleCheck />,
      });

      setIsEditing(false);
    } catch {}
  };

  return (
    <Paper withBorder radius={0} p="sm">
      <Group position="right">
        {isEditing ? (
          <>
            <Button
              leftIcon={<IconX />}
              color="red"
              variant="subtle"
              size="sm"
              loading={isLoading}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              loading={isLoading}
              leftIcon={<IconCheck />}
              color="green"
              variant="light"
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        ) : (
          <Button
            leftIcon={<IconEdit size={18} />}
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </Group>
      {isEditing ? (
        <Suspense fallback={<Skeleton height={200} />}>
          <TextEditor
            mt="md"
            value={editedDescription}
            onChange={(value) => setEditedDescription(value)}
          />
        </Suspense>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: project.description }} />
      )}
    </Paper>
  );
};
