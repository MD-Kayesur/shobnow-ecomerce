import { baseApi } from "@/redux/hooks/baseApi";

export interface TaxonomyMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TaxonomyEnvelope<T> {
  data: T[];
  meta: TaxonomyMeta;
}

export interface TaxonomySubcategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  _count?: { products: number };
  category?: { id: string; name: string; slug: string };
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  isActive: boolean;
  sortOrder: number;
  subCategories: TaxonomySubcategory[];
  _count?: { products: number; subCategories: number };
}

export interface TaxonomyBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  country?: string | null;
  website?: string | null;
  description?: string | null;
  verificationStatus: "VERIFIED" | "UNVERIFIED";
  isActive: boolean;
  _count?: { products: number };
}

interface ListQuery {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  categoryId?: string;
}

export interface BrandInput {
  name: string;
  country?: string;
  website?: string;
  description?: string;
  verificationStatus?: "VERIFIED" | "UNVERIFIED";
  isActive?: boolean;
  logo?: File;
}

export interface CategoryInput {
  name: string;
  isActive: boolean;
  sortOrder?: number;
  image?: File;
}

export interface SubcategoryInput extends CategoryInput {
  categoryId: string;
}

function brandFormData(input: BrandInput) {
  const form = new FormData();
  form.append("name", input.name.trim());
  form.append("country", input.country?.trim() ?? "");
  form.append("website", input.website?.trim() ?? "");
  form.append("description", input.description?.trim() ?? "");
  if (input.verificationStatus) form.append("verificationStatus", input.verificationStatus);
  if (input.isActive !== undefined) form.append("isActive", String(input.isActive));
  if (input.logo) form.append("logo", input.logo);
  return form;
}

function categoryFormData(input: CategoryInput) {
  const form = new FormData();
  form.append("name", input.name.trim());
  form.append("isActive", String(input.isActive));
  if (input.sortOrder !== undefined) form.append("sortOrder", String(input.sortOrder));
  if (input.image) form.append("image", input.image);
  return form;
}

function subcategoryFormData(input: SubcategoryInput) {
  const form = categoryFormData(input);
  form.append("categoryId", input.categoryId);
  return form;
}

export const taxonomyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTaxonomyCategories: build.query<TaxonomyEnvelope<TaxonomyCategory>, ListQuery>({
      query: (params) => ({ url: "/admin/categories", params }),
      providesTags: [{ type: "Taxonomy", id: "CATEGORIES" }],
    }),
    getTaxonomySubcategories: build.query<TaxonomyEnvelope<TaxonomySubcategory>, ListQuery>({
      query: (params) => ({ url: "/admin/sub-categories", params }),
      providesTags: [{ type: "Taxonomy", id: "SUBCATEGORIES" }],
    }),
    getTaxonomyBrands: build.query<TaxonomyEnvelope<TaxonomyBrand>, ListQuery>({
      query: (params) => ({ url: "/admin/brands", params }),
      providesTags: [{ type: "Taxonomy", id: "BRANDS" }],
    }),
    createCategory: build.mutation<unknown, CategoryInput>({
      query: (input) => ({ url: "/admin/categories", method: "POST", body: categoryFormData(input) }),
      invalidatesTags: [{ type: "Taxonomy", id: "CATEGORIES" }],
    }),
    updateCategory: build.mutation<unknown, { id: string; changes: CategoryInput }>({
      query: ({ id, changes }) => ({ url: `/admin/categories/${id}`, method: "PATCH", body: categoryFormData(changes) }),
      invalidatesTags: [{ type: "Taxonomy", id: "CATEGORIES" }],
    }),
    createSubcategory: build.mutation<unknown, SubcategoryInput>({
      query: (input) => ({ url: "/admin/sub-categories", method: "POST", body: subcategoryFormData(input) }),
      invalidatesTags: [{ type: "Taxonomy", id: "SUBCATEGORIES" }, { type: "Taxonomy", id: "CATEGORIES" }],
    }),
    updateSubcategory: build.mutation<unknown, { id: string; changes: SubcategoryInput }>({
      query: ({ id, changes }) => ({ url: `/admin/sub-categories/${id}`, method: "PATCH", body: subcategoryFormData(changes) }),
      invalidatesTags: [{ type: "Taxonomy", id: "SUBCATEGORIES" }, { type: "Taxonomy", id: "CATEGORIES" }],
    }),
    createBrand: build.mutation<unknown, BrandInput>({
      query: (input) => ({ url: "/admin/brands", method: "POST", body: brandFormData(input) }),
      invalidatesTags: [{ type: "Taxonomy", id: "BRANDS" }],
    }),
    updateBrand: build.mutation<unknown, { id: string; changes: BrandInput }>({
      query: ({ id, changes }) => ({ url: `/admin/brands/${id}`, method: "PATCH", body: brandFormData(changes) }),
      invalidatesTags: [{ type: "Taxonomy", id: "BRANDS" }],
    }),
  }),
});

export const {
  useGetTaxonomyCategoriesQuery,
  useGetTaxonomySubcategoriesQuery,
  useGetTaxonomyBrandsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} = taxonomyApi;
