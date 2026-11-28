import type { Product } from "@/data/shopData";
import type { StoreProduct } from "@/redux/features/storefront/storefrontApi";

const mediaUrl = (value?: string | null) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const apiOrigin = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1").replace(/\/api\/v\d+\/?$/, "");
  return `${apiOrigin}${value.startsWith("/") ? "" : "/"}${value}`;
};

export const toShopCardProduct = (item: StoreProduct): Product => {
  const regular = Number(item.price);
  const effectivePrice = Number(item.salePrice ?? item.price);
  const gallery = item.media || [];
  const mainMedia = gallery.find((media) => media.isPrimary) || gallery[0];
  const image = mediaUrl(mainMedia?.imageUrl);
  const stockQuantity = Math.max(item.stock || 0, ...item.variants.map((variant) => variant.stockQuantity || 0));
  return {
    id: item.id, name: item.name, slug: item.slug, brand: item.brand?.name || "Shop Now",
    category: item.category?.slug || "", subcategory: item.subCategory?.slug || "", price: effectivePrice,
    ...(effectivePrice < regular ? { originalPrice: regular, discountPercent: Math.round((1 - effectivePrice / regular) * 100) } : {}),
    rating: item.reviewSummary?.averageRating || 0, reviewsCount: item.reviewSummary?.reviewCount || 0,
    inStock: stockQuantity > 0, stockQuantity, image, hoverImage: mediaUrl(gallery.find((media) => media.id !== mainMedia?.id)?.imageUrl),
    description: item.shortDescription || item.description || "", volume: item.variants.find((variant) => variant.isDefault)?.variantName || "",
    isFeatured: item.displayType === "FEATURED", isNewArrival: item.displayType === "NEW_ARRIVAL", sku: item.variants[0]?.sku || undefined,
    productType: item.productType, galleryImages: gallery.map((media) => mediaUrl(media.imageUrl)).filter(Boolean),
  };
};
