import { emptyApi } from "./emptyApi";

export const visualCollabApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    addVisualCollab: builder.mutation<any, AddVisualCollabParams>({
      query: (params) => ({
        url: "/visual_collab",
        method: "POST",
        body: params,
      }),
    }),

    refreshVisualCollab: builder.mutation<any, RefreshVisualCollabParams>({
      query: (params) => ({
        url: "/visual_collab/refresh_collab",
        method: "POST",
        body: params,
      }),
    }),

    getVisualCollab: builder.query<
      any,
      { id: number; selectedBtn: string; search: string | null }
    >({
      query: ({ id, selectedBtn, search }) =>
        `/visual_collab/${id}?filter=${selectedBtn}&search=${search}`,
    }),
    getAllCollabs: builder.query<any, { projectId: number }>({
      query: ({ projectId }) => `/visual_collab?projectId=${projectId}`,
    }),
    deleteVisualCollabSuggestion: builder.mutation<
      any,
      DeleteVisualCollabSuggestionParams
    >({
      query: (params) => ({
        url: `/collab_suggestion/${params.id}`,
        method: "DELETE",
      }),
    }),
    deleteVisualCollab: builder.mutation<
      any,
      DeleteVisualCollabParams
    >({
      query: (params) => ({
        url: `/visual_collab/${params.id}`,
        method: "DELETE",
      }),
    }),
    addSuggestion: builder.mutation<any, AddVisualCollabSuggestionParams>({
      query: (params) => ({
        url: "/collab_suggestion",
        method: "POST",
        body: params,
      }),
    }),
    updateSuggestionStatus: builder.mutation<any, UpdateSuggestionStatusParams>(
      {
        query: (params) => ({
          url: "/collab_suggestion",
          method: "PATCH",
          body: params,
        }),
      }
    ),
    updateTitle: builder.mutation<any, UpdateTitleParams>(
      {
        query: (params) => ({
          url: "/visual_collab/update_title",
          method: "PATCH",
          body: params,
        }),
      }
    ),
  }),
});

export const {
  useGetVisualCollabQuery,
  useDeleteVisualCollabMutation,
  useDeleteVisualCollabSuggestionMutation,
  useAddVisualCollabMutation,
  useRefreshVisualCollabMutation,
  useAddSuggestionMutation,
  useUpdateSuggestionStatusMutation,
  useGetAllCollabsQuery,
  useUpdateTitleMutation,
} = visualCollabApi;

interface AddVisualCollabParams {
  imageLink?: string | null;
  isUrl?: Boolean;
  webUrl?: string | null;
  projectId?: number;
}

interface RefreshVisualCollabParams {
  imageLink?: string | null;
  isWebLink?: Boolean;
  webUrl?: string | null;
  collabId?: number;
}

interface AddVisualCollabSuggestionParams {
  collabId: number;
  suggestion: string;
  horizontalPos: number;
  verticalPos: number;
}

interface DeleteVisualCollabSuggestionParams {
  id: number;
}

interface DeleteVisualCollabParams {
  id: number;
}

interface UpdateSuggestionStatusParams {
  id: number;
  status: string;
}

interface UpdateTitleParams {
  id: number;
  title: string;
}
