import { Modal, Select, Button, ActionIcon } from "@mantine/core";

import { useState } from "react";
import { useUpdateSuggestionStatusMutation } from "@services/visualCollabApi";

type props = {
  id: number;
  status: string;
  updateData: () => void;
};

export const Status = ({ id, status, updateData }: props) => {
  const [updateSuggestionStatus, { isLoading: isUpdating }] =
    useUpdateSuggestionStatusMutation();

  let statusLabel = null;
  let color = "red";
  if (status === "to_do") {
    statusLabel = (
      <svg
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 1.23862L3.16992 6.73862L1 3.73862"
          stroke="#6F767E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
    color = "#FFFFFF";
  } else if (status === "in_review") {
    statusLabel = (
      <svg
        width="12"
        height="8"
        viewBox="0 -1 13 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7358 1.97256C9.94775 0.681991 7.96725 0 6.00847 0H5.99144C4.03265 0 2.05215 0.681991 0.264082 1.97256C-0.0215828 2.17881 -0.0854421 2.57688 0.121463 2.86165C0.328368 3.14641 0.727704 3.21007 1.01337 3.00382C1.74307 2.47715 2.49023 2.07017 3.25058 1.78328C3.08412 2.15547 2.99089 2.56712 2.99089 3C2.99089 4.65427 4.34088 6 6.00038 6C7.65988 6 9.00987 4.65427 9.00987 3C9.00987 2.5667 8.91663 2.15547 8.75017 1.78328C9.51053 2.07017 10.2577 2.47758 10.9874 3.00382C11.1006 3.0853 11.2318 3.12477 11.3612 3.12477C11.5591 3.12477 11.7541 3.03353 11.8789 2.86165C12.0853 2.57688 12.0215 2.17881 11.7358 1.97256ZM5.99995 4.72684C5.04461 4.72684 4.26765 3.95233 4.26765 3C4.26765 2.04767 5.04461 1.27316 5.99995 1.27316C6.95529 1.27316 7.73225 2.04767 7.73225 3C7.73225 3.95233 6.95487 4.72684 5.99995 4.72684Z"
          fill="white"
        />
      </svg>
    );
    color = "#FFCA66";
  } else if (status === "done") {
    statusLabel = (
      <svg
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 1.23862L3.16992 6.73862L1 3.73862"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
    color = "#75D985";
  }

  const [selectedValue, setSelectedValue] = useState(status);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = (value: any) => {
    setSelectedValue(value);
  };

  const saveStatus = () => {
    updateSuggestionStatus({ id, status: selectedValue }).then(() => {
      updateData();
    });
    setShowModal(false);
  };

  return (
    <>
      <ActionIcon
        color={color}
        size={18}
        variant="filled"
        loading={isUpdating}
        style={{
          cursor: "pointer",
          textAlign: "center",
          borderRadius: "200px",
          padding: "0px",
          margin: "9px",
          background: color,
          border: "1px solid #6F767E",
        }}
        onClick={() => setShowModal(true)}
      >
        {statusLabel}
      </ActionIcon>

      <Modal
        title="Suggestion status" 
        opened={showModal}
        onClose={() => setShowModal(false)}
      >
        <Select
          placeholder="Select status"
          defaultValue={status}
          data={[
            { label: "To Do", value: "to_do" },
            { label: "In Review", value: "in_review" },
            { label: "Done", value: "done" },
          ]}
          onChange={handleStatusChange}
        />
        <Button mt="lg" onClick={saveStatus} variant="default" color="gray">
          Done
        </Button>
      </Modal>
    </>
  );
};