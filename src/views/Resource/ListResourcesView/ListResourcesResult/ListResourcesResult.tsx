import React from "react";

// Routing
import { Link, useNavigate } from "react-router-dom";

// Services
import { useGetResourcesQuery } from "@services/resourceApi";

// Redux
import { useReduxSelector } from "@app/hook";
import { selectUser } from "@slices/authSlice";

// UI Components
import { Alert, Card, Group, Loader, SimpleGrid, Text } from "@mantine/core";

// UI Utils
import { showNotification } from "@mantine/notifications";

// Icons
import { IconExclamationMark, IconInfoCircle, IconLock } from "@tabler/icons";

// Interfaces
import { Resource } from "@interfaces/resource";

export const ListResourcesResult = () => {
  // Queries
  const { data: resources, isLoading } = useGetResourcesQuery();

  // Redux
  const user = useReduxSelector(selectUser);

  // Routing
  const navigate = useNavigate();

  // Handlers
  const handleResourceClick = (resource: Omit<Resource, "description">) => {
    if (!resource.isPrivate) return navigate(`/dashboard/resources/${resource.id}`);
    if (user?.hasAccessToPrivateResources) return navigate(`/dashboard/resources/${resource.id}`);
    showNotification({
      title: "Ooops!",
      message: "You do not have access to this resource",
      color: "orange",
      icon: <IconExclamationMark />,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!resources?.length) {
    return (
      <Alert color="blue" icon={<IconInfoCircle />}>
        No resources found
      </Alert>
    );
  }

  return (
    <SimpleGrid
      breakpoints={[
        { minWidth: "sm", cols: 2 },
        { minWidth: "md", cols: 3 },
        { minWidth: 1200, cols: 4 },
      ]}
    >
      {resources?.map((resource, i) => (
        <Card
          style={{ backgroundColor: resource.color, cursor: "pointer" }}
          onClick={() => handleResourceClick(resource)}
          key={i}
        >
          <Group>
            {resource.isPrivate && <IconLock size={20} color="#f4f4f4" />}
            <Text color="#fff">{resource.title}</Text>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
};
