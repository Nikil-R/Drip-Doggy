import axios from "axios";
import { API_CONFIG } from "@/app/utils/api-config";
import type { Product, ProductColorVariant } from "@/app/data/products";

export interface ProductListResponse {
  status: number;
  message: string;
  details: any[];
}

export const productApi = {
  mapBackendProduct: (p: any): Product => {
    const primaryVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
    const mainImage = primaryVariant
      ? (primaryVariant.primaryImageUrl || (primaryVariant.imageUrls && primaryVariant.imageUrls.length > 0 ? primaryVariant.imageUrls[0] : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop"))
      : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop";

    const allImages: string[] = [];
    if (mainImage) {
      allImages.push(mainImage);
    }
    if (p.variants) {
      p.variants.forEach((v: any) => {
        if (v.imageUrls) {
          v.imageUrls.forEach((img: string) => {
            if (img && !allImages.includes(img)) allImages.push(img);
          });
        }
      });
    }

    const allSizes: string[] = [];
    if (p.variants) {
      p.variants.forEach((v: any) => {
        if (v.sizes) {
          v.sizes.forEach((s: any) => {
            if (s.sizeName && !allSizes.includes(s.sizeName)) {
              allSizes.push(s.sizeName);
            }
          });
        }
      });
    }

    const finalPrice = primaryVariant ? Number(primaryVariant.price || primaryVariant.mrp) : 0;
    const originalPrice = primaryVariant && primaryVariant.discountValue && Number(primaryVariant.discountValue) > 0
      ? Number(primaryVariant.mrp)
      : undefined;

    const specsList: any[] = [];
    if (p.specification) {
      const spec = p.specification;
      if (spec.fabric) specsList.push({ label: "Fabric Type", value: spec.fabric });
      if (spec.fit) specsList.push({ label: "Fit / Size", value: spec.fit });
      if (spec.pattern) specsList.push({ label: "Pattern", value: spec.pattern });
      if (spec.neckCollarType) specsList.push({ label: "Neck/Collar Type", value: spec.neckCollarType });
      if (spec.sleeveType) specsList.push({ label: "Sleeve Type", value: spec.sleeveType });
      if (spec.pockets) specsList.push({ label: "Pockets", value: spec.pockets });
      if (spec.washCare) specsList.push({ label: "Wash Care", value: spec.washCare });
    }

    return {
      id: p.id,
      brand: p.baseTitle || "DripDoggy Collection",
      name: p.productName || "",
      price: finalPrice,
      originalPrice: originalPrice,
      rating: 0,
      reviewCount: 0,
      image: mainImage,
      images: allImages,
      badge: p.isActive === false ? "SOLD OUT" : (p.baseTitle || undefined),
      description: p.productDescription || "",
      sizes: allSizes,
      specs: specsList,
      designDetails: p.features ? p.features.map((f: any) => f.featureName) : [],
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId,
      subcategoryName: p.subcategoryName,
      rawVariants: p.variants
    };
  },

  fetchProducts: async (): Promise<Product[]> => {
    const url = API_CONFIG.BASE_URL + "/dripdoggy/api/public/products";
    const response = await axios.get<ProductListResponse>(url);
    const details = response.data.details || [];
    
    return details.map((p: any) => productApi.mapBackendProduct(p));
  },

  fetchProductById: async (id: number): Promise<Product | null> => {
    const url = API_CONFIG.BASE_URL + `/dripdoggy/api/public/products/${id}`;
    const response = await axios.get<any>(url);
    const p = response.data.details;
    if (!p) return null;

    const primaryVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
    const mainImage = primaryVariant
      ? (primaryVariant.primaryImageUrl || (primaryVariant.imageUrls && primaryVariant.imageUrls.length > 0 ? primaryVariant.imageUrls[0] : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop"))
      : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop";

    const allImages: string[] = [];
    if (mainImage) {
      allImages.push(mainImage);
    }
    if (p.variants) {
      p.variants.forEach((v: any) => {
        if (v.imageUrls) {
          v.imageUrls.forEach((img: string) => {
            if (img && !allImages.includes(img)) allImages.push(img);
          });
        }
      });
    }

    const allSizes: string[] = [];
    if (p.variants) {
      p.variants.forEach((v: any) => {
        if (v.sizes) {
          v.sizes.forEach((s: any) => {
            if (s.sizeName && !allSizes.includes(s.sizeName)) {
              allSizes.push(s.sizeName);
            }
          });
        }
      });
    }

    const finalPrice = primaryVariant ? Number(primaryVariant.price || primaryVariant.mrp) : 0;
    const originalPrice = primaryVariant && primaryVariant.discountValue && Number(primaryVariant.discountValue) > 0
      ? Number(primaryVariant.mrp)
      : undefined;

    const specsList: any[] = [];
    if (p.specification) {
      const spec = p.specification;
      if (spec.fabric) specsList.push({ label: "Fabric Type", value: spec.fabric });
      if (spec.fit) specsList.push({ label: "Fit / Size", value: spec.fit });
      if (spec.pattern) specsList.push({ label: "Pattern", value: spec.pattern });
      if (spec.neckCollarType) specsList.push({ label: "Neck/Collar Type", value: spec.neckCollarType });
      if (spec.sleeveType) specsList.push({ label: "Sleeve Type", value: spec.sleeveType });
      if (spec.pockets) specsList.push({ label: "Pockets", value: spec.pockets });
      if (spec.washCare) specsList.push({ label: "Wash Care", value: spec.washCare });
    }

    const colorVariants: ProductColorVariant[] = (p.variants || []).map((v: any) => {
      const variantImages: string[] = [];
      if (v.primaryImageUrl) {
        variantImages.push(v.primaryImageUrl);
      }
      if (v.imageUrls) {
        v.imageUrls.forEach((img: string) => {
          if (img && !variantImages.includes(img)) variantImages.push(img);
        });
      }
      if (variantImages.length === 0) {
        variantImages.push(mainImage);
      }
      return {
        name: v.variantName || "DEFAULT",
        thumbnail: v.primaryImageUrl || (v.imageUrls && v.imageUrls.length > 0 ? v.imageUrls[0] : mainImage),
        images: variantImages
      };
    });

    // Fetch active reviews for this product
    let activeReviews: any[] = [];
    try {
      const reviewsUrl = API_CONFIG.BASE_URL + `/dripdoggy/api/public/reviews/product/${id}`;
      const reviewsRes = await axios.get<any[]>(reviewsUrl);
      if (Array.isArray(reviewsRes.data)) {
        activeReviews = reviewsRes.data;
      }
    } catch (err) {
      console.error("Failed to load reviews for product id: " + id, err);
    }

    const mappedReviews = activeReviews.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      author: r.customerName || "Verified Buyer",
      rating: Number(r.rating ?? 5),
      title: "",
      content: r.comment || "",
      date: "Recent",
      verified: r.isVerifiedPurchase ?? true,
      images: r.imageUrls || []
    }));

    const avgRating = mappedReviews.length > 0
      ? Number((mappedReviews.reduce((sum, rev) => sum + rev.rating, 0) / mappedReviews.length).toFixed(1))
      : 0.0;

    return {
      id: p.id,
      brand: p.baseTitle || "DripDoggy Collection",
      name: p.productName || "",
      price: finalPrice,
      originalPrice: originalPrice,
      rating: avgRating,
      reviewCount: mappedReviews.length,
      reviews: mappedReviews,
      image: mainImage,
      images: allImages,
      badge: p.isActive === false ? "SOLD OUT" : (p.baseTitle || undefined),
      description: p.productDescription || "",
      variants: colorVariants,
      sizes: allSizes,
      specs: specsList,
      designDetails: p.features ? p.features.map((f: any) => f.featureName) : [],
      rawVariants: p.variants
    };
  }
};
