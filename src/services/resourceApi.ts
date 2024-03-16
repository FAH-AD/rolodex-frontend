import { emptyApi } from "./emptyApi";

// Interfaces
import { Resource } from "@interfaces/resource";

export const resourceApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getResources: builder.query<Omit<Resource, "description">[], void>({
      query: () => "/resources",
      providesTags: ["Resource"],
    }),
    getResourceById: builder.query<Resource, number>({
      query: (id) => `/resources/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Resource" as const, id }],
    }),
    createResource: builder.mutation<Resource, CreateResourceParams>({
      query: (body) => ({
        url: "/resources",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Resource"],
    }),
    deleteResource: builder.mutation<void, number>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useDeleteResourceMutation,
} = resourceApi;

export interface CreateResourceParams {
  title: string;
  description: string;
  color: string;
  isPrivate: boolean;
}
