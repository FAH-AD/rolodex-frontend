import React from "react";

// Services
import { useGetSlackRelationsQuery } from "@services/slackRelationApi";

// UI Components
import { Card, Alert, Loader, Button, Group, LoadingOverlay } from "@mantine/core";

// UI Utils
import { openModal } from "@mantine/modals";

// Components
import SlackRelationsTable from "@components/Tables/SlackRelations/SlackRelationsTable";

// Icons
import { IconInfoCircle, IconPlus } from "@tabler/icons";

// Lazy Components
const SlackRelationForm = React.lazy(
  () => import("@components/Forms/SlackRelation/SlackRelationForm")
);

export const SlackTab = () => {
  const { data, isLoading, isFetching } = useGetSlackRelationsQuery();

  const handleCreateSlackRelation = () => {
    openModal({
      key: "createSlackRelation",
      title: "New Slack Relation",
      children: (
        <React.Suspense fallback={<LoadingOverlay visible />}>
          <SlackRelationForm />
        </React.Suspense>
      ),
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card p="md" withBorder mt="md">
      <LoadingOverlay visible={isFetching} />
      <Group position="right" mb="sm">
        <Button leftIcon={<IconPlus />} onClick={handleCreateSlackRelation}>
          New Relation
        </Button>
      </Group>
      {data?.length === 0 && (
        <Alert color="cyan" icon={<IconInfoCircle />}>
          No relations found.
        </Alert>
      )}
      {data && data?.length > 0 && <SlackRelationsTable relations={data ?? []} />}
    </Card>
  );
};
