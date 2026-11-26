import { baseApi } from "@/redux/hooks/baseApi";

export type NewsletterStatus = "SUBSCRIBED" | "UNSUBSCRIBED";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: NewsletterStatus;
  source: string | null;
  visitorId: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscribersResult {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    subscribers: NewsletterSubscriber[];
    summary: { total: number; subscribed: number; unsubscribed: number };
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const newsletterAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNewsletterSubscribers: build.query<NewsletterSubscribersResult, {
      page: number;
      limit: number;
      search?: string;
      status?: NewsletterStatus;
    }>({
      query: (params) => ({ url: "/admin/newsletter/subscribers", params }),
      providesTags: ["Newsletter"],
    }),
  }),
});

export const { useGetNewsletterSubscribersQuery } = newsletterAdminApi;
