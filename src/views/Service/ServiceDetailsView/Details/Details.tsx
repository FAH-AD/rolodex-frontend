import React from "react";

// UI Components
import { Paper } from "@mantine/core";

// Interfaces
import { Service } from "@interfaces/service";

// Props
type DetailsProps = {
  service: Service;
};

export const Details: React.FC<DetailsProps> = ({ service }) => {
  return (
    <Paper withBorder p={16}>
      <img src={service.image} alt={service.title} width="100%" />
      <div dangerouslySetInnerHTML={{ __html: service.description }} />
    </Paper>
  );
};
