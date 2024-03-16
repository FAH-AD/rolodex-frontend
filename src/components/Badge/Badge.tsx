import React from "react";

// UI Components
import { DefaultMantineColor, MantineSize, Text, useMantineTheme } from "@mantine/core";

// Props
type BadgeProps = {
  color: DefaultMantineColor;
  text: string;
  textSize?: MantineSize;
};

export const Badge: React.FC<BadgeProps> = ({ color, text, textSize = "sm" }) => {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        backgroundColor: theme.colors[color][2],
        color: theme.colors[color][9],
        fontWeight: "bold",
        borderRadius: "1rem",
        padding: "4px 12px",
      }}
    >
      <Text size={textSize}>{text}</Text>
    </div>
  );
};
