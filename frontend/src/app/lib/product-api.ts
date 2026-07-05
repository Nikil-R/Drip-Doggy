import axios from "axios";
import { API_CONFIG } from "@/app/utils/api-config";
import type { Product, ProductColorVariant } from "@/app/data/products";

export interface ProductListResponse {
  status: number;
  message: string;
  details: any[];
}

export const productApi = {
  fetchProducts: async (): Promise<Product[]> => {
    const url = API_CONFIG.BASE_URL + "/dripdoggy/api/public/products";
    const response = await axios.get<ProductListResponse>(url);
    const details = response.data.details || [];
    
    return details.map((p: any) => {
      const primaryVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
      const mainImage = primaryVariant && primaryVariant.imageUrls && primaryVariant.imageUrls.length > 0
        ? primaryVariant.imageUrls[0]
        : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop";

      const allImages: string[] = [];
      if (p.variants) {
        p.variants.forEach((v: any) => {
          if (v.imageUrls) {
            v.imageUrls.forEach((img: string) => {
              if (!allImages.includes(img)) allImages.push(img);
            });
          }
        });
      }
      if (allImages.length === 0) {
        allImages.push(mainImage);
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
        brand: p.baseTitle || "Drip Doggy Collection",
        name: p.productName || "",
        price: finalPrice,
        originalPrice: originalPrice,
        rating: 5,
        reviewCount: 1,
        image: mainImage,
        images: allImages,
        badge: p.isActive === false ? "SOLD OUT" : (p.baseTitle || undefined),
        description: p.productDescription || "",
        sizes: allSizes,
        specs: specsList,
        designDetails: p.features ? p.features.map((f: any) => f.featureName) : [],
        rawVariants: p.variants
      };
    });
  },

  fetchProductById: async (id: number): Promise<Product | null> => {
    const url = API_CONFIG.BASE_URL + `/dripdoggy/api/public/products/${id}`;
    const response = await axios.get<any>(url);
    const p = response.data.details;
    if (!p) return null;

    const primaryVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
    const mainImage = primaryVariant && primaryVariant.imageUrls && primaryVariant.imageUrls.length > 0
      ? primaryVariant.imageUrls[0]
      : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop";

    const allImages: string[] = [];
    if (p.variants) {
      p.variants.forEach((v: any) => {
        if (v.imageUrls) {
          v.imageUrls.forEach((img: string) => {
            if (!allImages.includes(img)) allImages.push(img);
          });
        }
      });
    }
    if (allImages.length === 0) {
      allImages.push(mainImage);
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

    const colorVariants: ProductColorVariant[] = (p.variants || []).map((v: any) => ({
      name: v.variantName || "DEFAULT",
      thumbnail: v.imageUrls && v.imageUrls.length > 0 ? v.imageUrls[0] : mainImage,
      images: v.imageUrls && v.imageUrls.length > 0 ? v.imageUrls : [mainImage]
    }));

    return {
      id: p.id,
      brand: p.baseTitle || "Drip Doggy Collection",
      name: p.productName || "",
      price: finalPrice,
      originalPrice: originalPrice,
      rating: 5,
      reviewCount: 1,
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
