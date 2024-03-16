import { emptyApi } from "./emptyApi";

// Interfaces
import { Service } from "@interfaces/service";

export const serviceApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<GetServicesResponse, GetServicesRequest>({
      query: (params) => (params.tag ? `/services?tag=${params.tag}` : "/services"),
      providesTags: ["Service"],
    }),
    getServiceById: builder.query<GetServiceResponse, string | number>({
      query: (id) => `/services/${id}`,
    }),
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (body) => {
        return {
          url: "/services",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Service"],
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery, useCreateServiceMutation } = serviceApi;

interface GetServicesRequest {
  tag?: string;
}

interface GetServicesResponse {
  services: Service[];
}

interface GetServiceResponse {
  service: Service;
}

interface CreateServiceRequest {
  title: string;
  description: string;
  cost: number;
  deliveryInDays: number;
  image: string;
  orderIndex: number;
  tags: string[];
}
