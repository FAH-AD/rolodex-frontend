import { emptyApi } from "./emptyApi";

// Interfaces
import { SlackRelation } from "@interfaces/slackRelation";

export const slackRelationApi = emptyApi.injectEndpoints({
  endpoints: (build) => ({
    getSlackRelations: build.query<SlackRelation[], void>({
      query: () => "/slack_relations",
      providesTags: ["SlackRelation"],
    }),
    createSlackRelation: build.mutation<SlackRelation, CreateSlackRelationParams>({
      query: (body) => ({
        url: "/slack_relations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SlackRelation"],
    }),
    deleteSlackRelation: build.mutation<any, number>({
      query: (id) => ({
        url: `/slack_relations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SlackRelation"],
    }),
  }),
});

export const {
  useGetSlackRelationsQuery,
  useCreateSlackRelationMutation,
  useDeleteSlackRelationMutation,
} = slackRelationApi;

interface CreateSlackRelationParams {
  userId: number;
  slackId: string;
}
