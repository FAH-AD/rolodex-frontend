import { emptyApi } from "./emptyApi";

// Utils
import pickBy from "lodash/pickBy";

// Interfaces
import { Project, ProjectPriority, ProjectProgressName } from "@interfaces/project";

export const projectApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<GetProjectsResponse, GetProjectsParams | void>({
      query: (args) => ({
        url: "/projects",
        ...(args?.query && {
          params: {
            page: args.query.page,
            limit: args.query.limit,
            sortBy: args.query.sortBy,
            sortDirection: args.query.sortDirection,
            progresses: args.progresses?.join(","),
          },
        }),
      }),
      providesTags: (result, _e) => (result ? ["Project"] : []),
    }),
    getProjectById: builder.query<GetProjectByIdResponse, number>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, _e, id) => (result ? [{ type: "Project" as const, id }] : []),
    }),
    createProject: builder.mutation<CreateProjectResponse, CreateProjectParams>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body: pickBy(body, (value) => value !== ""),
      }),
      invalidatesTags: (result) => (result ? ["Project"] : []),
    }),
    createProjectRequest: builder.mutation<CreateProjectResponse, CreateProjectRequestParams>({
      query: (body) => ({
        url: "/projects/request",
        method: "POST",
        body: pickBy(body, (value) => value !== ""),
      }),
      invalidatesTags: (result) => (result ? ["Project"] : []),
    }),
    updateProjectProgress: builder.mutation<
      UpdateProjectProgressParams,
      UpdateProjectProgressParams
    >({
      query: (body) => ({
        url: `/projects/${body.id}/progress`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _error, body) => (result ? [{ type: "Project", id: body.id }] : []),
    }),
    updateProjectStatus: builder.mutation<UpdateProjectStatusParams, UpdateProjectStatusParams>({
      query: (body) => ({
        url: `/projects/${body.projectId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _error, body) =>
        result ? ["Project", { type: "Project", id: body.projectId }] : [],
    }),
    updateProjectEstimatedDelivery: builder.mutation<
      UpdateProjectEstimatedDeliveryParams,
      UpdateProjectEstimatedDeliveryParams
    >({
      query: (body) => ({
        url: `/projects/${body.id}/estimated_delivery`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _e, body) =>
        result ? [{ type: "Project" as const, id: body.id }] : [],
    }),
    updateProjectEstimatedHours: builder.mutation<
      UpdateProjectEstimatedHoursParams,
      UpdateProjectEstimatedHoursParams
    >({
      query: (body) => ({
        url: `/projects/${body.id}/estimated_hours`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _e, body) =>
        result ? [{ type: "Project" as const, id: body.id }] : [],
    }),
    updateProjectPriority: builder.mutation<
      UpdateProjectPriorityParams,
      UpdateProjectPriorityParams
    >({
      query: (body) => ({
        url: `/projects/${body.id}/priority`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _e, body) =>
        result ? ["Project", { type: "Project" as const, id: body.id }] : [],
    }),
    updateProjectClient: builder.mutation<UpdateProjectClientParams, UpdateProjectClientParams>({
      query: (body) => ({
        url: `/projects/${body.id}/client`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _e, body) =>
        result ? ["Project", { type: "Project" as const, id: body.id }] : [],
    }),
    updateProjectDescription: builder.mutation<
      UpdateProjectDescriptionParams,
      UpdateProjectDescriptionParams
    >({
      query: (body) => ({
        url: `/projects/${body.id}/description`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _e, body) =>
        result ? ["Project", { type: "Project" as const, id: body.id }] : [],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useCreateProjectRequestMutation,
  useUpdateProjectProgressMutation,
  useUpdateProjectStatusMutation,
  useUpdateProjectEstimatedDeliveryMutation,
  useUpdateProjectEstimatedHoursMutation,
  useUpdateProjectPriorityMutation,
  useUpdateProjectClientMutation,
  useUpdateProjectDescriptionMutation,
} = projectApi;

interface GetProjectsResponse {
  projects: Project[];
  totalPages: number;
  totalCount: number;
}

interface GetProjectByIdResponse {
  project: Project;
}

interface CreateProjectResponse {
  project: Project;
}

interface GetProjectsParams {
  progresses?: ProjectProgressName[];
  query?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
  };
}

interface CreateProjectParams {
  clientEmail: string;
  title: string;
  description: string;
  budget: number;
  deliveryInDays: number;
  managers: { id: number }[];
}

interface CreateProjectRequestParams {
  title: string;
  description: string;
  budget: number | null;
  needNewStore: boolean;
  signupForm: boolean;
  storeURL: string;
  deliveryInDays: number;
}

interface UpdateProjectProgressParams {
  id: number;
  progress: string;
  oldProgress: string;
}

interface UpdateProjectStatusParams {
  projectId: number;
  statusId: number;
}

interface UpdateProjectEstimatedDeliveryParams {
  id: number;
  estimatedDeliveryDate: Date;
}

interface UpdateProjectEstimatedHoursParams {
  id: number;
  estimatedHours: number | null;
}

interface UpdateProjectPriorityParams {
  id: number;
  priority: ProjectPriority;
}

interface UpdateProjectClientParams {
  id: number;
  clientId: number;
}

interface UpdateProjectDescriptionParams {
  id: number;
  description: string;
}
