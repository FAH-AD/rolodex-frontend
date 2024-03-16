// Routing
import { useSearchParams } from "react-router-dom";

// Services
import { useLoginWithMagicLinkQuery } from "@services/authApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";

// Mantine
import { Alert, LoadingOverlay } from "@mantine/core";

export const MagicLinkView = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { isLoading, isFetching, error } = useLoginWithMagicLinkQuery(
    token ? { token } : skipToken
  );

  if (!searchParams.get("token")) {
    return (
      <Alert variant="filled" color="red">
        Invalid request
      </Alert>
    );
  }

  if (isLoading || isFetching) {
    return <LoadingOverlay visible />;
  }

  if (error) {
    return (
      <Alert variant="filled" color="red">
        Could not authenticate
      </Alert>
    );
  }

  return (
    <Alert variant="filled" color="blue">
      Authenticating...
    </Alert>
  );
};
