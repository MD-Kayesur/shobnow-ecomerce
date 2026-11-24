import { baseApi } from "@/redux/hooks/baseApi";

export type BannerType = "PRIMARY" | "SECONDARY" | "MIDDLE" | "LAST_MIDDLE" | "FOOTER";
export type BannerStatus = "ACTIVE" | "DRAFT";

export interface AdminBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string;
  targetUrl: string | null;
  type: BannerType;
  position: number | null;
  sortOrder: number | null;
  status: BannerStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BannerListResponse {
  success: boolean;
  data: AdminBanner[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface BannerResponse {
  success: boolean;
  data: AdminBanner;
  message?: string;
}

export interface BannerQuery {
  page: number;
  limit: number;
  type?: BannerType;
  status?: BannerStatus;
  sortDirection?: "ASC" | "DESC";
}

export interface BannerInput {
  type: BannerType;
  title?: string;
  subtitle?: string;
  targetUrl?: string;
  status: BannerStatus;
  position?: number;
  sortOrder?: number;
  startsAt?: string;
  endsAt?: string;
  image?: File;
}

function toFormData(input: BannerInput) {
  const form = new FormData();
  if (input.title !== undefined) form.append("title", input.title);
  if (input.subtitle !== undefined) form.append("subtitle", input.subtitle);
  if (input.targetUrl !== undefined) form.append("targetUrl", input.targetUrl);
  form.append("status", input.status);
  if (input.position !== undefined) form.append("position", String(input.position));
  if (input.sortOrder !== undefined) form.append("sortOrder", String(input.sortOrder));
  if (input.startsAt) form.append("startsAt", new Date(input.startsAt).toISOString());
  if (input.endsAt) form.append("endsAt", new Date(input.endsAt).toISOString());
  if (input.image) form.append("image", input.image);
  return form;
}

function typeRoute(type: BannerType) {
  return type === "LAST_MIDDLE" ? "last-middle" : type.toLowerCase();
}

export const bannersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminBanners: build.query<BannerListResponse, BannerQuery>({
      query: (params) => ({ url: "/admin/banners", params }),
      providesTags: (result) => [
        { type: "Banners", id: "LIST" },
        ...(result?.data ?? []).map(({ id }) => ({ type: "Banners" as const, id })),
      ],
    }),
    getAdminBanner: build.query<BannerResponse, string>({
      query: (id) => `/admin/banners/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Banners", id }],
    }),
    createAdminBanner: build.mutation<BannerResponse, BannerInput>({
      query: ({ type, ...input }) => ({
        url: `/admin/banners/${typeRoute(type)}`,
        method: "POST",
        body: toFormData(input as BannerInput),
      }),
      invalidatesTags: [{ type: "Banners", id: "LIST" }],
    }),
    updateAdminBanner: build.mutation<BannerResponse, { id: string; changes: BannerInput }>({
      query: ({ id, changes }) => ({
        url: `/admin/banners/${typeRoute(changes.type)}/${id}`,
        method: "PATCH",
        body: toFormData(changes),
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Banners", id }, { type: "Banners", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAdminBannersQuery,
  useGetAdminBannerQuery,
  useCreateAdminBannerMutation,
  useUpdateAdminBannerMutation,
} = bannersApi;
