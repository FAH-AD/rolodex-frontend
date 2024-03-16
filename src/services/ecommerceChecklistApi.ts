import { emptyApi } from "./emptyApi";

// Interfaces
import { EcommerceChecklist, EcommerceChecklistItem } from "@interfaces/ecommerceChecklist";

export const ecommerceChecklistApi = emptyApi.injectEndpoints({
  endpoints: (builder) => ({
    getEcommerceChecklists: builder.query<EcommerceChecklist[], GetEcommerceChecklistParams>({
      query: (params) => `/ecommerce_checklists?category=${encodeURIComponent(params.category)}`,
      providesTags: ["EcommerceChecklist"],
    }),
    getEcommerceChecklistItems: builder.query<EcommerceChecklistItem[], number>({
      query: (checklistId) => `/ecommerce_checklists/items/${checklistId}`,
      providesTags: (_r, _e, id) => [{ type: "EcommerceChecklist" as const, id }],
    }),
    createEcommerceChecklist: builder.mutation<EcommerceChecklist, CreateEcommerceChecklistParams>({
      query: (body) => ({
        url: "/ecommerce_checklists",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EcommerceChecklist"],
    }),
    updateEcommerceChecklist: builder.mutation<EcommerceChecklist, UpdateEcommerceChecklistParams>({
      query: (body) => ({
        url: "/ecommerce_checklists",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["EcommerceChecklist"],
    }),
    createEcommerceChecklistItem: builder.mutation<
      EcommerceChecklist,
      CreateEcommerceChecklistItemParams
    >({
      query: (body) => ({
        url: "/ecommerce_checklists/items",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [
        { type: "EcommerceChecklist" as const, id: body.checklistId },
      ],
    }),
    updateEcommerceChecklistItem: builder.mutation<
      EcommerceChecklist,
      UpdateEcommerceChecklistItemParams
    >({
      query: (body) => ({
        url: "/ecommerce_checklists/items",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, body) => [
        { type: "EcommerceChecklist" as const, id: body.checklistId },
      ],
    }),
    deleteEcommerceChecklist: builder.mutation<any, number>({
      query: (id) => ({
        url: `/ecommerce_checklists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EcommerceChecklist"],
    }),
    deleteEcommerceChecklistItem: builder.mutation<any, number>({
      query: (id) => ({
        url: `/ecommerce_checklists/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "EcommerceChecklist" as const, id }],
    }),
  }),
});

export const {
  useGetEcommerceChecklistsQuery,
  useGetEcommerceChecklistItemsQuery,
  useCreateEcommerceChecklistMutation,
  useUpdateEcommerceChecklistMutation,
  useCreateEcommerceChecklistItemMutation,
  useUpdateEcommerceChecklistItemMutation,
  useDeleteEcommerceChecklistMutation,
  useDeleteEcommerceChecklistItemMutation,
} = ecommerceChecklistApi;

interface GetEcommerceChecklistParams {
  category: string;
}

interface CreateEcommerceChecklistParams {
  name: string;
  orderIndex: number;
  color: string;
  category: string;
}

interface CreateEcommerceChecklistItemParams {
  checklistId: number;
  name: string;
  description: string | null;
  orderIndex: number;
}

interface UpdateEcommerceChecklistParams extends Partial<CreateEcommerceChecklistParams> {
  id: number;
}

interface UpdateEcommerceChecklistItemParams extends Partial<CreateEcommerceChecklistItemParams> {
  id: number;
}
