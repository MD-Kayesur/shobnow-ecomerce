import { baseApi } from "@/redux/hooks/baseApi";

export type PromoCarouselStatus = "ACTIVE" | "DRAFT";

export interface PromoCarouselBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string;
  targetUrl: string | null;
  position: number;
  sortOrder: number;
  status: PromoCarouselStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PromoCarouselPage {
  success: boolean;
  data: PromoCarouselBanner[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface PromoCarouselInput {
  title?: string;
  subtitle?: string;
  targetUrl?: string;
  status?: PromoCarouselStatus;
  position?: number;
  sortOrder?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  image?: File;
}

function toFormData(input: PromoCarouselInput) {
  const form = new FormData();
  if (input.title !== undefined) form.append("title", input.title);
  if (input.subtitle !== undefined) form.append("subtitle", input.subtitle);
  if (input.targetUrl !== undefined) form.append("targetUrl", input.targetUrl);
  if (input.status !== undefined) form.append("status", input.status);
  if (input.position !== undefined) form.append("position", String(input.position));
  if (input.sortOrder !== undefined) form.append("sortOrder", String(input.sortOrder));
  if (input.startsAt !== undefined) form.append("startsAt", input.startsAt ? new Date(input.startsAt).toISOString() : "");
  if (input.endsAt !== undefined) form.append("endsAt", input.endsAt ? new Date(input.endsAt).toISOString() : "");
  if (input.image) form.append("image", input.image);
  return form;
}

export const promoCarouselApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPromoCarouselBanners: build.query<SuccessResponse<PromoCarouselBanner[]>, void>({
      query: () => "/promo-carousel-banners",
      providesTags: (result) => [
        { type: "PromoCarouselBanners", id: "PUBLIC" },
        ...(result?.data || []).map(({ id }) => ({ type: "PromoCarouselBanners" as const, id })),
      ],
    }),
    getAdminPromoCarouselBanners: build.query<PromoCarouselPage, { page: number; limit: number; status?: PromoCarouselStatus }>({
      query: (params) => ({ url: "/admin/promo-carousel-banners", params }),
      providesTags: (result) => [
        { type: "PromoCarouselBanners", id: "LIST" },
        ...(result?.data || []).map(({ id }) => ({ type: "PromoCarouselBanners" as const, id })),
      ],
    }),
    createPromoCarouselBanner: build.mutation<SuccessResponse<PromoCarouselBanner>, PromoCarouselInput>({
      query: (input) => ({ url: "/admin/promo-carousel-banners", method: "POST", body: toFormData(input) }),
      invalidatesTags: [{ type: "PromoCarouselBanners", id: "LIST" }, { type: "PromoCarouselBanners", id: "PUBLIC" }],
    }),
    updatePromoCarouselBanner: build.mutation<SuccessResponse<PromoCarouselBanner>, { id: string; changes: PromoCarouselInput }>({
      query: ({ id, changes }) => ({ url: `/admin/promo-carousel-banners/${id}`, method: "PATCH", body: toFormData(changes) }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PromoCarouselBanners", id },
        { type: "PromoCarouselBanners", id: "LIST" },
        { type: "PromoCarouselBanners", id: "PUBLIC" },
      ],
    }),
    deletePromoCarouselBanner: build.mutation<SuccessResponse<null>, string>({
      query: (id) => ({ url: `/admin/promo-carousel-banners/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PromoCarouselBanners", id },
        { type: "PromoCarouselBanners", id: "LIST" },
        { type: "PromoCarouselBanners", id: "PUBLIC" },
      ],
    }),
  }),
});

export const {
  useGetPromoCarouselBannersQuery,
  useGetAdminPromoCarouselBannersQuery,
  useCreatePromoCarouselBannerMutation,
  useUpdatePromoCarouselBannerMutation,
  useDeletePromoCarouselBannerMutation,
} = promoCarouselApi;
