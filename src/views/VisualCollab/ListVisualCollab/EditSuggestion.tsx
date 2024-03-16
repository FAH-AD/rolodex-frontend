import React from "react";
import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useUpdateSuggestionStatusMutation } from "@services/visualCollabApi";


type props = {
  id: number;
};

export const EditSuggestion: React.FC<props> = ({
  id
}) => {
  const [updateCollabSuggestion, { isLoading: isUpdating }] =
    useUpdateSuggestionStatusMutation();

  return (
    <Text
      title="Edit suggestion"
      style={{
        color: "#6F767E",
        fontSize: "12px",
        width: "110.93px",
        height: "11.86px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 500,
        lineHeight: "15px",
      }}
    >
      Edit
    </Text>
  );
};