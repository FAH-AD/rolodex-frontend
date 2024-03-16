import { ActionIcon } from "@mantine/core";
import { IconCheck } from "@tabler/icons";

import { useUpdateSuggestionStatusMutation } from "@services/visualCollabApi";

type props = {
  id: number;
  status: string;
};

export const UpdateStatus = ({ id, status }: props) => {
  let statusObj = {
    color: "red",
    title: "Start review",
    nextStatus: "in_review",
  };

  if (status == "in_review") {
    statusObj.title = "Mark as done";
    statusObj.color = "yellow";
    statusObj.nextStatus = "done";
  } else if (status == "done") {
    statusObj.title = "Start review";
    statusObj.color = "green";
    statusObj.nextStatus = "to_do";
  } else if (status == "to_do") {
    statusObj.title = "Start review";
    statusObj.color = "black";
    statusObj.nextStatus = "to_do";
  }

  const [updateSuggestionStatus, { isLoading: isUpdating }] =
    useUpdateSuggestionStatusMutation();

  const handleStatusUpdate = () => {
    updateSuggestionStatus({
      id,
      status: statusObj.nextStatus,
    });
  };

  return (
    <>
      <ActionIcon
        key="to_do"
        variant="subtle"
        title={statusObj.title}
        color={statusObj.color}
        loading={isUpdating}
        onClick={handleStatusUpdate}
        style={{
          borderRadius: "200px",
        }}
      >
        <IconCheck size={18} />
      </ActionIcon>
    </>
  );
};