import { baseApi } from "@/redux/hooks/baseApi";

export type AdminStoreOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: string | number;
  currencyCode: string;
  recipientName: string;
  recipientPhone: string;
  createdAt: string;
  city: string;
  addressLine: string;
  user: { id: string; name: string; email: string };
  items: Array<{ productName: string; quantity: number; lineTotal: string | number }>;
};
type OrdersPage = { data: AdminStoreOrder[]; meta: { page: number; limit: number; total: number; totalPages: number } };
type ApiResponse<T> = { data: T; message?: string };

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminOrders: build.query<OrdersPage, { status?: string; limit?: number }>({
      query: (params) => ({ url: "/admin/orders", params }),
      providesTags: ["Orders"],
    }),
    confirmOrderCall: build.mutation<ApiResponse<AdminStoreOrder>, string>({
      query: (orderId) => ({ url: `/admin/orders/${orderId}/confirm-call`, method: "POST" }),
      invalidatesTags: ["Orders"],
    }),
    startConfirmedOrder: build.mutation<ApiResponse<AdminStoreOrder>, string>({
      query: (orderId) => ({ url: `/admin/orders/${orderId}/confirm-delivery`, method: "POST", body: {} }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetAdminOrdersQuery, useConfirmOrderCallMutation, useStartConfirmedOrderMutation } = ordersApi;
