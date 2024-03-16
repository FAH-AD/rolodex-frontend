import React from "react";

// UI Components
import { LoadingOverlay } from "@mantine/core";

export const LoadingScreen = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <LoadingOverlay visible />
    </div>
  );
};
