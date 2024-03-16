// Routing
import { Navigate, useParams } from "react-router-dom";

// Services
import { useGetServiceByIdQuery } from "@services/serviceApi";
import { skipToken } from "@reduxjs/toolkit/dist/query";

// UI Components
import { Grid, Loader } from "@mantine/core";

// Components
import { PageWrapper } from "@components/PageWrapper";
import { OrderNow } from "./OrderNow";
import { Details } from "./Details";

export const ServiceDetailsView = () => {
  const { id } = useParams();

  const { details, isLoading } = useGetServiceByIdQuery(id ?? skipToken, {
    selectFromResult: ({ data, ...rest }) => ({ details: data?.service, ...rest }),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!id) {
    return <Navigate to="/dashboard/services" replace />;
  }

  return (
    <PageWrapper
      title={details?.title || ""}
      breadcrumbs={[
        {
          label: "Services",
          link: "/dashboard/services",
        },
        {
          label: details
            ? details.title.length > 20
              ? `${details.title.slice(0, 20)}...`
              : details.title
            : "",
          link: `/dashboard/services/${id}`,
        },
      ]}
    >
      {details && (
        <Grid mt="md">
          <Grid.Col md={8}>
            <Details service={details} />
          </Grid.Col>
          <Grid.Col md={4}>
            <OrderNow service={details} />
          </Grid.Col>
        </Grid>
      )}
    </PageWrapper>
  );
};
