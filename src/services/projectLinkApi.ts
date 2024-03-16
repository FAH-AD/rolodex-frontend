import { ProjectLinkType } from "@interfaces/project";
import { emptyApi } from "./emptyApi";
import { ProjectLink } from "@interfaces/project";

export const projectLinkApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    createProjectLink: build.mutation<ProjectLink, CreateProjectLinkParams>({
      query: (body) => ({
        url: "/project_links",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, _error, body) =>
        result ? ["Project", { type: "Project" as const, id: body.projectId }] : [],
    }),
  }),
});

export const { useCreateProjectLinkMutation } = projectLinkApi;

interface CreateProjectLinkParams {
  projectId: number;
  name: string;
  url: string;
  type: ProjectLinkType;
}
