import { baseApi } from "@/redux/hooks/baseApi";

export interface StoreCategory {
  id: string; name: string; slug: string; image?: string | null; _count: { products: number };
  subCategories: Array<{ id: string; name: string; slug: string; image?: string | null; _count: { products: number } }>;
}
export interface StoreBrand { id: string; name: string; slug: string; logo?: string | null; _count: { products: number } }
export interface StoreProduct {
  id: string; name: string; slug: string; shortDescription?: string | null; description?: string | null;
  productType: string; productCategory?: string | null; condition?: string | null;
  authenticityType?: string | null; authenticityVerified: boolean; countryOfOrigin?: string | null; manufacturer?: string | null;
  price: number | string; salePrice?: number | string | null; stock: number; isFeatured: boolean; displayType: string; createdAt: string;
  category?: { id: string; name: string; slug: string } | null; subCategory?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string; logo?: string | null; country?: string | null; website?: string | null; description?: string | null; verificationStatus?: string } | null;
  metadata?: { metaTitle?: string | null; metaDescription?: string | null; metaKeywords: string[] } | null;
  media: Array<{ id: string; imageUrl: string; thumbnailUrl?: string | null; imageRole?: string | null; altText?: string | null; isPrimary: boolean; sortOrder: number }>;
  variants: Array<{ id: string; variantName: string; sku?: string | null; color?: string | null; size?: string | null; weight?: number | string | null; volume?: number | string | null; unit?: string | null; sellingPrice: number | string; stockQuantity: number; isDefault: boolean }>;
  attributes: Array<{ id: string; name: string; value: string; sortOrder: number }>;
  cosmeticDetails?: Record<string, unknown> | null; productIngredients?: Array<Record<string, unknown>>;
  skinCompatibility?: Array<Record<string, unknown>>; concernCompatibility?: Array<Record<string, unknown>>; contraindications?: Array<Record<string, unknown>>;
  jewelryDetails?: Record<string, unknown> | null; jewelryMeasurements?: Array<Record<string, unknown>>; jewelrySizeOptions?: Array<Record<string, unknown>>;
  tryOnAssets?: Array<{ id: string; variantId?: string | null }>;
  jewelryMaterials?: Array<Record<string, unknown>>; gemstones?: Array<Record<string, unknown>>;
  reviewSummary: { averageRating: number; reviewCount: number; distribution?: Record<string, number> };
}
export interface StoreReview { id: string; rating: number; title?: string | null; comment: string; isVerifiedPurchase: boolean; createdAt: string; user: { name?: string | null } }
export interface PromoBar { headline: string; offerText: string | null; deliveryText: string | null; isActive: boolean; startsAt: string | null; endsAt: string | null }
export interface NewsletterSubscribeResponse { success: boolean; statusCode: number; message: string; data: null; timestamp?: string; path?: string }
export interface ApiPage<T> { data: T[]; meta?: { page: number; limit: number; total: number; totalPages: number } }
export interface StoreProductQuery { page?: number; limit?: number; search?: string; category?: string; subcategory?: string; brand?: string; minPrice?: number; maxPrice?: number; inStock?: boolean; onSale?: boolean; minRating?: number; sort?: string; productCategory?: string; jewelryCategory?: string; tryOnEligible?: boolean; productIds?: string }
type Envelope<T> = { data: T };
interface WishlistPage { data: Array<{ id: string; product: { id: string } }>; meta?: { page: number; limit: number; total: number; totalPages: number } }
export type OrderRequest = {
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  recipientName: string; recipientPhone: string; recipientEmail?: string;
  addressLine: string; city: string; area?: string; postalCode?: string;
  customerNote?: string; couponCode?: string; paymentMethod: "CALL_CONFIRMATION";
};
export interface CustomerOrder { id: string; orderNumber: string; status: string; total: string | number; recipientName: string; recipientPhone: string }
export interface MyOrderSummary {
  id: string; orderNumber: string; status: string; paymentStatus: string; paymentMethod: string;
  total: string | number; currencyCode: string; createdAt: string;
  items: Array<{ productName: string; variantName?: string | null; quantity: number; unitPrice: string | number; lineTotal: string | number }>;
}
export interface CouponValidation { code: string; name: string; discountType: "PERCENT" | "FIXED"; discountValue: number | string; subtotal: number; discountAmount: number; totalAfterDiscount: number }
export interface SupportRequestInput { name: string; email: string; phone?: string; orderId?: string; subject: string; message: string }

export const storefrontApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    subscribeNewsletter: build.mutation<NewsletterSubscribeResponse, { email: string; source?: string }>({
      query: (body) => ({ url: "/newsletter/subscribe", method: "POST", body }),
    }),
    getPromoBar: build.query<Envelope<PromoBar | null>, void>({
      query: () => "/promo-bar", providesTags: ["PromoBar"],
    }),
    getStoreFilterOptions: build.query<Envelope<{ categories: StoreCategory[]; brands: StoreBrand[]; priceRange: { min: number; max: number } }>, void>({
      query: () => "/products/filter-options", providesTags: ["Taxonomy"],
    }),
    getStoreProducts: build.query<ApiPage<StoreProduct>, StoreProductQuery>({
      query: (params) => ({ url: "/products", params }), providesTags: ["Products"],
    }),
    getStoreProduct: build.query<Envelope<StoreProduct>, string>({
      query: (slug) => `/products/${encodeURIComponent(slug)}`, providesTags: (_result, _error, slug) => [{ type: "Products", id: slug }, "Reviews"],
    }),
    getProductReviews: build.query<ApiPage<StoreReview>, { productId: string; page?: number; limit?: number }>({
      query: ({ productId, ...params }) => ({ url: `/products/${productId}/reviews`, params }), providesTags: (_result, _error, arg) => [{ type: "Reviews", id: arg.productId }],
    }),
    createProductReview: build.mutation<Envelope<StoreReview>, { productId: string; rating: number; title?: string; comment: string }>({
      query: ({ productId, ...body }) => ({ url: `/products/${productId}/reviews`, method: "POST", body }), invalidatesTags: (_result, _error, arg) => [{ type: "Reviews", id: arg.productId }, { type: "Products", id: arg.productId }],
    }),
    getWishlist: build.query<WishlistPage, void>({
      query: () => "/wishlist/items?limit=50",
      providesTags: ["Wishlist"],
    }),
    addWishlistItem: build.mutation<Envelope<unknown>, { productId: string }>({
      query: (body) => ({ url: "/wishlist/items", method: "POST", body }),
      invalidatesTags: ["Wishlist"],
    }),
    removeWishlistItem: build.mutation<Envelope<null>, string>({
      query: (productId) => ({ url: `/wishlist/items/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Wishlist"],
    }),
    createOrder: build.mutation<Envelope<CustomerOrder>, OrderRequest>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
    }),
    getMyOrders: build.query<{ data: MyOrderSummary[]; meta?: { page: number; limit: number; total: number; totalPages: number } }, void>({
      query: () => "/orders?limit=50",
      providesTags: ["Orders"],
    }),
    submitSupportRequest: build.mutation<Envelope<{ id: string; reference: string; status: string; createdAt: string }>, SupportRequestInput>({
      query: (body) => ({ url: "/support/requests", method: "POST", body }),
    }),
    validateCoupon: build.mutation<Envelope<CouponValidation>, { code: string; subtotal: number }>({
      query: (body) => ({ url: "/coupons/validate", method: "POST", body }),
    }),
    startJewelryTryOn: build.mutation<Envelope<{ sessionId: string; status: string; statusUrl: string }>, FormData>({
      query: (body) => ({ url: "/ai/jewelry/try-on", method: "POST", body }),
    }),
    getJewelryTryOn: build.query<Envelope<{ id: string; status: string; errorMessage?: string | null; images: Array<{ id: string; url: string }> }>, string>({
      query: (sessionId) => `/ai/jewelry/try-on/${sessionId}`,
    }),
    deleteJewelryTryOn: build.mutation<Envelope<null>, string>({
      query: (sessionId) => ({ url: `/ai/jewelry/try-on/${sessionId}`, method: "DELETE" }),
    }),
    saveAiLook: build.mutation<Envelope<{ id: string }>, { generatedImageId: string; title?: string }>({
      query: (body) => ({ url: "/ai/saved-looks", method: "POST", body }), invalidatesTags: ["SavedLooks"],
    }),
    getAiLooks: build.query<Envelope<Array<{ id: string; title?: string; createdAt: string; products: Array<{ id: string; name: string; slug: string }>; imageUrl: string | null }>>, void>({
      query: () => "/ai/saved-looks?limit=50", providesTags: ["SavedLooks"],
    }),
    setAiLookFavorite: build.mutation<Envelope<{ id: string; isFavorite: boolean }>, { id: string; isFavorite: boolean }>({
      query: ({ id, isFavorite }) => ({ url: `/ai/saved-looks/${id}/favorite`, method: "PATCH", body: { isFavorite } }), invalidatesTags: ["SavedLooks"],
    }),
    deleteAiLook: build.mutation<Envelope<null>, string>({
      query: (id) => ({ url: `/ai/saved-looks/${id}`, method: "DELETE" }), invalidatesTags: ["SavedLooks"],
    }),
  }),
});

export const { useSubscribeNewsletterMutation, useGetPromoBarQuery, useGetStoreFilterOptionsQuery, useGetStoreProductsQuery, useGetStoreProductQuery, useGetProductReviewsQuery, useCreateProductReviewMutation, useGetWishlistQuery, useAddWishlistItemMutation, useRemoveWishlistItemMutation, useCreateOrderMutation, useGetMyOrdersQuery, useSubmitSupportRequestMutation, useValidateCouponMutation, useStartJewelryTryOnMutation, useGetJewelryTryOnQuery, useDeleteJewelryTryOnMutation, useSaveAiLookMutation, useGetAiLooksQuery, useDeleteAiLookMutation, useSetAiLookFavoriteMutation } = storefrontApi;
