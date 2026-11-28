import { baseApi } from "@/redux/hooks/baseApi";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  productCategory?: string | null;
  displayType?: string;
  status: string;
  price: number | string;
  salePrice?: number | string | null;
  stock: number;
  sku?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  categoryId?: string | null;
  brandId?: string | null;
  createdAt: string;
  productType?: string;
  description?: string | null;
  condition?: string | null;
  authenticityType?: string | null;
  authenticityVerified?: boolean;
  countryOfOrigin?: string | null;
  manufacturer?: string | null;
  sellerName?: string | null;
  subCategoryId?: string | null;
  isFeatured?: boolean;
  shippingRequired?: boolean;
  taxable?: boolean;
  faq?: Array<{ question: string; answer: string }> | null;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Envelope<T> { data: T; }
interface Paginated<T> extends Envelope<T[]> { meta: PageMeta; }
interface InventorySummary {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}
export interface ProductMedia { id: string; imageUrl: string; imageRole?: string | null; altText?: string | null; isPrimary: boolean; sortOrder: number; }
export interface ProductVariant { id: string; variantName: string; sku?: string | null; color?: string | null; size?: string | null; weight?: number | string | null; volume?: number | string | null; unit?: string | null; sellingPrice: number | string; stockQuantity: number; isDefault?: boolean; }
export interface ProductAttribute { id: string; name: string; value: string; sortOrder: number; }
export interface ProductMetadata { id: string; metaTitle?: string | null; metaDescription?: string | null; metaKeywords: string[]; }
export interface ProductSetupProgress { productId: string; completedSteps: number; totalSteps: number; percentage: number; steps: Array<{ key: string; complete: boolean }>; }
export type CreateAdminProduct = Pick<AdminProduct, "name" | "price"> & Partial<Omit<AdminProduct, "id" | "name" | "slug" | "price" | "createdAt">>;
export interface LookupRow { id: string; name: string; }
type InventoryFilter = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export const adminProductsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminProducts: build.query<Paginated<AdminProduct>, {
      page: number; limit: number; search?: string; categoryId?: string;
      inventoryStatus?: InventoryFilter;
    }>({
      query: (params) => ({ url: "/admin/products/all", params }),
      providesTags: (result) => [
        { type: "Products", id: "LIST" },
        ...(result?.data ?? []).map(({ id }) => ({ type: "Products" as const, id })),
      ],
    }),
    getInventorySummary: build.query<Envelope<InventorySummary>, void>({
      query: () => "/admin/products/inventory-summary",
      providesTags: [{ type: "Products", id: "SUMMARY" }],
    }),
    getAdminProductMedia: build.query<Envelope<ProductMedia[]>, string>({
      query: (id) => `/admin/products/${id}/media`,
    }),
    getAdminProduct: build.query<Envelope<AdminProduct>, string>({
      query: (id) => `/admin/products/by-id/${id}`,
    }),
    getAdminProductVariants: build.query<Envelope<ProductVariant[]>, string>({
      query: (id) => `/admin/products/${id}/variants`,
    }),
    getAdminProductAttributes: build.query<Envelope<ProductAttribute[]>, string>({
      query: (id) => `/admin/products/${id}/attributes`,
    }),
    getAdminProductMetadata: build.query<Envelope<ProductMetadata | null>, string>({
      query: (id) => `/admin/products/${id}/metadata`,
    }),
    getAdminCosmeticDetails: build.query<Envelope<Record<string, unknown>>, string>({
      query: (id) => `/admin/products/${id}/cosmetics`,
    }),
    getAdminJewelryDetails: build.query<Envelope<Record<string, unknown>>, string>({
      query: (id) => `/admin/products/${id}/jewelry`,
    }),
    getAdminProductSetupProgress: build.query<Envelope<ProductSetupProgress[]>, string[]>({
      query: (ids) => ({ url: "/admin/products/setup-progress", params: { ids: ids.join(",") } }),
      providesTags: (result) => [
        { type: "Products", id: "LIST" },
        ...(result?.data ?? []).map(({ productId }) => ({ type: "Products" as const, id: productId })),
      ],
    }),
    createAdminProduct: build.mutation<Envelope<AdminProduct>, CreateAdminProduct>({
      query: (body) => ({ url: "/admin/products", method: "POST", body }),
      invalidatesTags: [{ type: "Products", id: "LIST" }, { type: "Products", id: "SUMMARY" }],
    }),
    updateAdminProduct: build.mutation<Envelope<AdminProduct>, { id: string; body: Partial<CreateAdminProduct> }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Products", id }, { type: "Products", id: "LIST" }],
    }),
    uploadAdminProductMedia: build.mutation<unknown, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}/media`, method: "POST", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Products", id }],
    }),
    updateAdminProductMedia: build.mutation<unknown, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/admin/product-media/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Products", id }, { type: "Products", id: "LIST" }],
    }),
    deleteAdminProductMedia: build.mutation<unknown, { id: string; productId: string }>({
      query: ({ id }) => ({ url: `/admin/product-media/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    createAdminProductVariant: build.mutation<unknown, { productId: string; body: Record<string, unknown> }>({
      query: ({ productId, body }) => ({ url: `/admin/products/${productId}/variants`, method: "POST", body }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    updateAdminProductVariant: build.mutation<unknown, { id: string; productId: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/product-variants/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    deleteAdminProductVariant: build.mutation<unknown, { id: string; productId: string }>({
      query: ({ id }) => ({ url: `/admin/product-variants/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    createAdminProductAttribute: build.mutation<unknown, { productId: string; body: Record<string, unknown> }>({
      query: ({ productId, body }) => ({ url: `/admin/products/${productId}/attributes`, method: "POST", body }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    updateAdminProductAttribute: build.mutation<unknown, { id: string; productId: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/product-attributes/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    deleteAdminProductAttribute: build.mutation<unknown, { id: string; productId: string }>({
      query: ({ id }) => ({ url: `/admin/product-attributes/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    createAdminProductMetadata: build.mutation<unknown, { productId: string; body: Record<string, unknown> }>({
      query: ({ productId, body }) => ({ url: `/admin/products/${productId}/metadata`, method: "POST", body }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: "Products", id: productId }, { type: "Products", id: "LIST" }],
    }),
    updateAdminProductMetadata: build.mutation<unknown, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/product-metadata/${id}`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    saveAdminCosmeticDetails: build.mutation<unknown, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}/cosmetics`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Products", id }, { type: "Products", id: "LIST" }],
    }),
    saveAdminJewelryDetails: build.mutation<unknown, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}/jewelry`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Products", id }, { type: "Products", id: "LIST" }],
    }),
    getAdminBrands: build.query<Paginated<LookupRow>, void>({
      query: () => ({ url: "/admin/brands", params: { page: 1, limit: 100 } }),
    }),
    getAdminCategories: build.query<Paginated<LookupRow>, void>({
      query: () => ({ url: "/admin/categories", params: { page: 1, limit: 100 } }),
    }),
    deleteAdminProduct: build.mutation<unknown, string>({
      query: (id) => ({ url: `/admin/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Products", id: "LIST" }, { type: "Products", id: "SUMMARY" }],
    }),
  }),
});

export const {
  useGetAdminProductsQuery,
  useGetInventorySummaryQuery,
  useGetAdminProductMediaQuery,
  useGetAdminProductQuery,
  useGetAdminProductVariantsQuery,
  useGetAdminProductAttributesQuery,
  useGetAdminProductMetadataQuery,
  useGetAdminCosmeticDetailsQuery,
  useGetAdminJewelryDetailsQuery,
  useGetAdminProductSetupProgressQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useUploadAdminProductMediaMutation,
  useUpdateAdminProductMediaMutation,
  useDeleteAdminProductMediaMutation,
  useCreateAdminProductVariantMutation,
  useUpdateAdminProductVariantMutation,
  useDeleteAdminProductVariantMutation,
  useCreateAdminProductAttributeMutation,
  useUpdateAdminProductAttributeMutation,
  useDeleteAdminProductAttributeMutation,
  useCreateAdminProductMetadataMutation,
  useUpdateAdminProductMetadataMutation,
  useSaveAdminCosmeticDetailsMutation,
  useSaveAdminJewelryDetailsMutation,
  useGetAdminBrandsQuery,
  useGetAdminCategoriesQuery,
  useDeleteAdminProductMutation,
} = adminProductsApi;
