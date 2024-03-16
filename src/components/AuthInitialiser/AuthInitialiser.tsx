import React from "react";

// Services
import { useGetProfileQuery } from "@services/authApi";

// Mantine
import { LoadingOverlay } from "@mantine/core";

// Props
type AuthInitialiserProps = {
  children: React.ReactNode;
};

export const AuthInitialiser: React.FC<AuthInitialiserProps> = ({ children }) => {
  const { isLoading, isFetching } = useGetProfileQuery();

  if (isLoading || isFetching) {
    return <LoadingOverlay visible />;
  }

  return <>{children}</>;
};
