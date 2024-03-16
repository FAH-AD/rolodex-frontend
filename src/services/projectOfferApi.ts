import { emptyApi } from "./emptyApi";

export const projectOfferApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    createProjectOffer: builder.mutation<CreateProjectOfferParams, CreateProjectOfferParams>({
      query: (body) => ({
        url: "/project_offers",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [
        { type: "Project" as const, id: body.projectId },
        { type: "ProjectMessage" as const, id: body.projectId },
      ],
    }),
  }),
});

export const { useCreateProjectOfferMutation } = projectOfferApi;

interface CreateProjectOfferParams {
  projectId: number;
  amount: number;
  deliveryInDays: number;
}
