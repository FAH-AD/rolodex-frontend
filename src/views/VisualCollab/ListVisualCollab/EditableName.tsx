import React, { useState } from "react";
import { Text, Input, Button } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useUpdateTitleMutation } from "@services/visualCollabApi";

type EditableTextProps = {
  initialValue: string;
  id: number
  editStatus: Boolean
  setEditStatus: (status: boolean) => void
};

const EditableText: React.FC<EditableTextProps> = ({ initialValue, id, editStatus, setEditStatus }) => {
  const [textValue, setTextValue] = useState(initialValue);

  const [updateCollabTitle, { isLoading: isUpdating }] =
    useUpdateTitleMutation();

  const handleSaveClick = () => {
    setEditStatus(false);
    updateCollabTitle({ id, title: textValue });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.currentTarget.value);
  };

  return (
    <div style={{ display: "flex" }}>
      {editStatus ? (
        <Input
          value={textValue}
          onChange={handleChange}
          style={{ width: 392, height: 39 }}
          size="lg"
          variant="filled"
          autoFocus
        />
      ) : (
        <Text
          style={{
            width: 392,
            height: 39,
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: "1.563rem",
            lineHeight: 2.344,
            cursor: "pointer",
          }}
        >
          {textValue}
        </Text>
      )}
      {editStatus && (
        <Button
          variant="filled"
          onClick={handleSaveClick}
          style={{
            height: "50px",
            borderRadius: "5px",
            lineHeight: 2.344,
            backgroundColor: "#2371BD",
            fontSize: "1rem",
          }}
        >
          Save
        </Button>
      )}
    </div>
  );
};

export default EditableText;
