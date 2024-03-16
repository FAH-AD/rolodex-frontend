import { emptyApi } from "./emptyApi";

// Interfaces
import { ProjectStatus } from "@interfaces/project";

export const projectStatusApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getProjectStatuses: build.query<ProjectStatus[], void>({
      query: () => "/project_statuses",
    }),
  }),
});

export const { useGetProjectStatusesQuery } = projectStatusApi;
