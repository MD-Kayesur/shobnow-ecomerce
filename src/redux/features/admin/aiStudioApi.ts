import { baseApi } from "@/redux/hooks/baseApi";

export type AiStudioSettings = {
  isEnabled: boolean;
  supportedCategories: string[];
  dailyGenerationLimit: number;
  generatedImageRetentionDays: number;
  updatedAt: string;
};
export type AiStudioDashboard = {
  settings: AiStudioSettings;
  provider: { name: string; apiKeyConfigured: boolean; privateProcessingConfirmed: boolean; model: string };
  analytics: {
    totalSessions: number;
    sessionsLast30Days: number;
    generatedImages: number;
    savedLooks: number;
    completedSessions: number;
    failedSessions: number;
    failureRate: number;
    topProducts: Array<{ id: string; name: string; slug: string; tryOnCount: number }>;
  };
};
type Envelope<T> = { data: T };
type UpdateInput = Omit<AiStudioSettings, "updatedAt">;
export type AdminTryOnAsset = { id: string; productId: string; assetName?: string | null; assetType: string; isApproved: boolean; isActive: boolean; createdAt: string };

export const aiStudioApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAiStudioDashboard: build.query<Envelope<AiStudioDashboard>, void>({
      query: () => "/admin/ai/try-on/dashboard",
      providesTags: ["AiStudioDashboard"],
    }),
    updateAiStudioSettings: build.mutation<Envelope<AiStudioSettings>, UpdateInput>({
      query: (body) => ({ url: "/admin/ai/try-on/settings", method: "PATCH", body }),
      invalidatesTags: ["AiStudioDashboard"],
    }),
    getAdminTryOnAssets: build.query<Envelope<AdminTryOnAsset[]>, string>({
      query: (productId) => `/admin/products/${productId}/try-on-assets`,
      providesTags: (_result, _error, productId) => [{ type: "Products", id: `TRYON-${productId}` }],
    }),
    uploadAdminTryOnAsset: build.mutation<unknown, { productId: string; body: FormData }>({
      query: ({ productId, body }) => ({ url: `/admin/products/${productId}/try-on-assets`, method: "POST", body }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: `TRYON-${productId}` }],
    }),
    updateAdminTryOnAsset: build.mutation<unknown, { assetId: string; productId: string; isApproved: boolean; isActive: boolean }>({
      query: ({ assetId, isApproved, isActive }) => ({ url: `/admin/jewelry-try-on-assets/${assetId}`, method: "PATCH", body: { isApproved, isActive } }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: `TRYON-${productId}` }, "AiStudioDashboard"],
    }),
  }),
});

export const { useGetAiStudioDashboardQuery, useUpdateAiStudioSettingsMutation, useGetAdminTryOnAssetsQuery, useUploadAdminTryOnAssetMutation, useUpdateAdminTryOnAssetMutation } = aiStudioApi;
