import { emptyApi } from "./emptyApi";

// Interfaces
import { Project, ProjectTask } from "@interfaces/project";

export const projectTaskApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.query<ProjectTask[], number>({
      query: (projectId) => `/project_tasks/${projectId}`,
      providesTags: (_result, _error, projectId) => [
        { type: "ProjectTask" as const, id: projectId },
      ],
    }),
    createProjectTask: builder.mutation<any, CreateProjectTaskParams>({
      query: (params) => ({
        url: "/project_tasks",
        method: "POST",
        body: params,
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: "ProjectTask" as const, id: params.projectId },
      ],
    }),
    updateProjectTask: builder.mutation<any, UpdateProjectTaskParams>({
      query: (params) => ({
        url: `/project_tasks/${params.id}`,
        method: "PUT",
        body: params,
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: "ProjectTask" as const, id: params.projectId },
      ],
    }),
    deleteProjectTask: builder.mutation<any, DeleteProjectTaskParams>({
      query: (params) => ({
        url: `/project_tasks/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, params) => [
        { type: "ProjectTask" as const, id: params.projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectTasksQuery,
  useCreateProjectTaskMutation,
  useUpdateProjectTaskMutation,
  useDeleteProjectTaskMutation,
} = projectTaskApi;

interface CreateProjectTaskParams {
  projectId: number;
  title: string;
  description: string | null;
}

interface UpdateProjectTaskParams extends Partial<ProjectTask> {
  id: number;
  projectId: number;
}

interface DeleteProjectTaskParams {
  id: number;
  projectId: number;
}
