import { baseApi } from "@/redux/hooks/baseApi";
import type { PromoBar } from "@/redux/features/storefront/storefrontApi";

type PromoBarResponse = { success: boolean; data: PromoBar | null; message?: string };
export type PromoBarInput = Omit<PromoBar, "startsAt" | "endsAt"> & {
  startsAt: string | null;
  endsAt: string | null;
};

export const promoBarAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminPromoBar: build.query<PromoBarResponse, void>({
      query: () => "/admin/promo-bar",
      providesTags: ["PromoBar"],
    }),
    saveAdminPromoBar: build.mutation<PromoBarResponse, PromoBarInput>({
      query: (body) => ({ url: "/admin/promo-bar", method: "PUT", body }),
      invalidatesTags: ["PromoBar"],
    }),
    deleteAdminPromoBar: build.mutation<{ success: boolean; data: null }, void>({
      query: () => ({ url: "/admin/promo-bar", method: "DELETE" }),
      invalidatesTags: ["PromoBar"],
    }),
  }),
});

export const { useGetAdminPromoBarQuery, useSaveAdminPromoBarMutation, useDeleteAdminPromoBarMutation } = promoBarAdminApi;
