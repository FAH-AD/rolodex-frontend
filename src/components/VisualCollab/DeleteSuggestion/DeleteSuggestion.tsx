import { Text, createStyles } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useDeleteVisualCollabSuggestionMutation } from "@services/visualCollabApi";

// Styles
const useStyles = createStyles((theme) => ({
  font: {
    color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.black,
  },
}));

type props = {
  id: number;
  updateData: () => void;
};

export const DeleteSuggestion: React.FC<props> = ({ id, updateData }) => {
  const [deleteCollabSuggestion, { isLoading: isDeleting }] =
    useDeleteVisualCollabSuggestionMutation();
  const { classes } = useStyles();

  const handleDelete = () => {
    openConfirmModal({
      title: "Delete Visual Collab Suggestion",
      children: "Are you sure you want to delete this suggestion?",
      onConfirm: () => {
        deleteCollabSuggestion({ id })
          .then(() => {
            updateData();
          })
          .catch((error) => {
            console.error("Error deleting suggestion:", error);
          });
      },
      labels: { cancel: "Cancel", confirm: "Delete" },
      confirmProps: { color: "red", loading: isDeleting },
    });
  };

  return (
    <Text
      className={classes.font}
      title="Delete suggestion"
      onClick={handleDelete}
      style={{
        fontSize: "12px",
        width: "110.93px",
        height: "0px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 400,
        lineHeight: "0px",
      }}
    >
      Delete
    </Text>
  );
};
