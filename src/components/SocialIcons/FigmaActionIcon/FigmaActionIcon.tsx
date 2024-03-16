import { ActionIcon, ActionIconProps } from "@mantine/core";
import FigmaIcon from "@assets/images/figma.png";

export const FigmaActionIcon = (props: ActionIconProps) => {
  return (
    <ActionIcon size="xs" p="md" radius="xl" color="gray" variant="light">
      <img src={FigmaIcon} alt="Figma" width={12} />
    </ActionIcon>
  );
};
