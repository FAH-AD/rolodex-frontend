import { emptyApi } from "./emptyApi";

export const projectManagerApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePrimaryManager: builder.mutation<any, UpdatePrimaryManagerParams>({
      query: (body) => ({
        url: `/project_managers/${body.projectId}/primary`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [{ type: "Project" as const, id: body.projectId }],
    }),
    addManager: builder.mutation<any, AddManagerParams>({
      query: (body) => ({
        url: "/project_managers",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [{ type: "Project" as const, id: body.projectId }],
    }),
  }),
});

export const { useUpdatePrimaryManagerMutation, useAddManagerMutation } = projectManagerApi;

interface UpdatePrimaryManagerParams {
  projectId: number;
  managerId: number;
}

interface AddManagerParams {
  projectId: number;
  userId: number;
}
