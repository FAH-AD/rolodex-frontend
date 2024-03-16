import { ActionIcon, ActionIconProps } from "@mantine/core";
import GoogleDriveIcon from "@assets/images/google-drive.svg.png";

export const GoogleDriveActionIcon = (props: ActionIconProps) => {
  return (
    <ActionIcon size="xs" p="md" radius="xl" color="gray" variant="light">
      <img src={GoogleDriveIcon} alt="Google Drive" width={20} />
    </ActionIcon>
  );
};
