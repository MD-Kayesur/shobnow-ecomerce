import { baseApi } from "@/redux/hooks/baseApi";

export type BannerType = "PRIMARY" | "SECONDARY" | "MIDDLE" | "LAST_MIDDLE" | "FOOTER";
export type BannerStatus = "ACTIVE" | "DRAFT";

export interface PublicBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string;
  targetUrl: string | null;
  type: BannerType;
  position: number | null;
  sortOrder: number | null;
  status: BannerStatus;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface BannersResponse {
  success: boolean;
  message?: string;
  data: PublicBanner[];
}

export interface SingleBannerResponse {
  success: boolean;
  message?: string;
  data: PublicBanner | null;
}

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<
      BannersResponse,
      { page?: number; limit?: number; type?: BannerType; sortDirection?: "ASC" | "DESC" } | void
    >({
      query: (params) => ({
        url: "/banners",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Banner" as const, id })),
              { type: "Banner", id: "LIST" },
            ]
          : [{ type: "Banner", id: "LIST" }],
    }),

    getHomepageBanners: builder.query<BannersResponse, "ASC" | "DESC" | void>({
      query: (sortDirection = "ASC") => ({
        url: "/banners/homepage",
        params: { sortDirection: sortDirection || "ASC" },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Banner" as const, id })),
              { type: "Banner", id: "HOMEPAGE" },
            ]
          : [{ type: "Banner", id: "HOMEPAGE" }],
    }),

    getMiddleBanner: builder.query<SingleBannerResponse, void>({
      query: () => "/banners/middle",
      providesTags: [{ type: "Banner", id: "MIDDLE" }],
    }),

    getLastMiddleBanners: builder.query<BannersResponse, void>({
      query: () => "/banners/last-middle",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Banner" as const, id })),
              { type: "Banner", id: "LAST_MIDDLE" },
            ]
          : [{ type: "Banner", id: "LAST_MIDDLE" }],
    }),

    getFooterBanners: builder.query<BannersResponse, void>({
      query: () => "/banners/footer",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Banner" as const, id })),
              { type: "Banner", id: "FOOTER" },
            ]
          : [{ type: "Banner", id: "FOOTER" }],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetHomepageBannersQuery,
  useGetMiddleBannerQuery,
  useGetLastMiddleBannersQuery,
  useGetFooterBannersQuery,
} = bannerApi;
