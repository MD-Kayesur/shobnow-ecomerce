import { baseApi } from "@/redux/hooks/baseApi";

export type SupportRequestStatus = "NEW" | "IN_PROGRESS" | "RESOLVED";
export type AdminSupportRequest = {
  id: string; name: string; email: string; phone: string | null; orderId: string | null;
  subject: string; message: string; status: SupportRequestStatus; createdAt: string; updatedAt: string; resolvedAt: string | null;
};
type SupportPage = {
  data: { requests: AdminSupportRequest[]; summary: { new: number; inProgress: number; resolved: number } };
  meta: { page: number; limit: number; total: number; totalPages: number };
};
type Envelope<T> = { data: T };

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSupportRequests: build.query<SupportPage, { page: number; limit: number; search?: string; status?: SupportRequestStatus }>({
      query: (params) => ({ url: "/admin/support/requests", params }),
      providesTags: ["SupportRequests"],
    }),
    updateSupportRequestStatus: build.mutation<Envelope<AdminSupportRequest>, { id: string; status: SupportRequestStatus }>({
      query: ({ id, status }) => ({ url: `/admin/support/requests/${id}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: ["SupportRequests"],
    }),
  }),
});

export const { useGetSupportRequestsQuery, useUpdateSupportRequestStatusMutation } = supportApi;
