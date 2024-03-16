import { emptyApi } from "./emptyApi";

// Interfaces
import { ProjectMessage } from "@interfaces/project";

export const projectMessageApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectMessages: builder.query<GetProjectMessagesResponse, number>({
      query: (projectId) => `/project_messages/${projectId}`,
      keepUnusedDataFor: 10,
      providesTags: (_r, _e, id) => [{ type: "ProjectMessage" as const, id }],
    }),
  }),
});

export const { useGetProjectMessagesQuery } = projectMessageApi;

interface GetProjectMessagesResponse {
  messages: ProjectMessage[];
}
