import React from "react";

// Services
import { useDeleteSlackRelationMutation } from "@services/slackRelationApi";

// UI Components
import { ActionIcon, LoadingOverlay, Table } from "@mantine/core";

// UI Utils
import { openConfirmModal } from "@mantine/modals";

// Icons
import { IconTrash } from "@tabler/icons";

// Interfaces
import { SlackRelation } from "@interfaces/slackRelation";

// Props
type SlackRelationsTableProps = {
  relations: SlackRelation[];
};

const SlackRelationsTable: React.FC<SlackRelationsTableProps> = ({ relations }) => {
  // Mutations
  const [deleteSlackRelation, { isLoading }] = useDeleteSlackRelationMutation();

  // Handlers
  const handleDelete = (id: number) => () => {
    openConfirmModal({
      title: "Are you sure you want to delete this relation?",
      confirmProps: { color: "red" },
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: async () => {
        try {
          await deleteSlackRelation(id).unwrap();
        } catch {}
      },
    });
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>Slack ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {relations.map((relation, i) => (
            <tr key={i}>
              <td>{relation.userId}</td>
              <td>{relation.user.name}</td>
              <td>{relation.slackId}</td>
              <td>
                <ActionIcon size="sm" color="red" onClick={handleDelete(relation.id)}>
                  <IconTrash />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default SlackRelationsTable;
