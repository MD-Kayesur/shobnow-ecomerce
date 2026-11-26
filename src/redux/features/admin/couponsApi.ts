import { baseApi } from "@/redux/hooks/baseApi";

export type AdminCoupon = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  discountType: "PERCENT" | "FIXED";
  discountValue: string | number;
  minimumOrder: string | number;
  maximumDiscount?: string | number | null;
  usageLimit?: number | null;
  usageCount: number;
  perUserLimit?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
  createdAt: string;
};

export type CreateCouponInput = {
  code: string;
  name: string;
  description?: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minimumOrder?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startsAt?: string;
  endsAt?: string;
};

type ApiResponse<T> = { data: T; message?: string };

export const couponsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminCoupons: build.query<ApiResponse<AdminCoupon[]>, void>({
      query: () => "/admin/coupons",
      providesTags: ["Coupons"],
    }),
    createAdminCoupon: build.mutation<ApiResponse<AdminCoupon>, CreateCouponInput>({
      query: (body) => ({ url: "/admin/coupons", method: "POST", body }),
      invalidatesTags: ["Coupons"],
    }),
    updateAdminCouponStatus: build.mutation<ApiResponse<AdminCoupon>, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({ url: `/admin/coupons/${id}/status`, method: "PATCH", body: { isActive } }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const { useGetAdminCouponsQuery, useCreateAdminCouponMutation, useUpdateAdminCouponStatusMutation } = couponsApi;
