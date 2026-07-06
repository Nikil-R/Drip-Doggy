import { wishlistApi } from "./wishlist-api";
import { productApi } from "./product-api";

export async function syncWishlist() {
  const token = localStorage.getItem("dripdoggy_auth_token");
  if (!token) return;

  try {
    const [backendItems, products] = await Promise.all([
      wishlistApi.getWishlist(),
      productApi.fetchProducts()
    ]);

    // Map sizeId to product and variant details
    const sizeToDetailsMap = new Map<string, { 
      productId: number; 
      brand: string; 
      name: string; 
      mrp: number; 
      price: number; 
      discountType: string;
      discountValue: number;
    }>();
    products.forEach(p => {
      if (p.rawVariants) {
        p.rawVariants.forEach(v => {
          if (v.sizes) {
            v.sizes.forEach((s: any) => {
              sizeToDetailsMap.set(String(s.id), {
                productId: p.id,
                brand: p.brand,
                name: p.name,
                mrp: v.mrp || 0,
                price: v.price || v.mrp || 0,
                discountType: v.discountType || "",
                discountValue: v.discountValue || 0
              });
            });
          }
        });
      }
    });

    const mappedItems = backendItems
      .filter(item => item.isActive !== false)
      .map(item => {
        const details = sizeToDetailsMap.get(String(item.productVariantSizeId));
        const productId = details ? details.productId : item.productVariantSizeId;
        
        const mrp = details ? details.mrp : (item.price || 0);
        const price = details ? details.price : (item.price || 0);
        const discountType = details ? details.discountType : "";
        const discountValue = details ? details.discountValue : 0;
        
        return {
          id: productId,
          brand: details ? details.brand : "Drip Doggy",
          name: item.productName || (details ? details.name : "Product"),
          price: price,
          originalPrice: mrp,
          discountType,
          discountValue,
          image: item.primaryImageUrl || "",
          backendId: item.id
        };
      });

    localStorage.setItem("wishlist", JSON.stringify(mappedItems));
    window.dispatchEvent(new Event("wishlist-updated"));
  } catch (err) {
    console.error("Error syncing wishlist with backend:", err);
  }
}

// Function to handle merging local guest wishlist to backend wishlist on login
export async function mergeLocalWishlistToBackend() {
  const token = localStorage.getItem("dripdoggy_auth_token");
  if (!token) return;

  try {
    const stored = localStorage.getItem("wishlist");
    const localItems = stored ? JSON.parse(stored) : [];
    if (localItems.length === 0) {
      await syncWishlist();
      return;
    }

    // Load products to resolve size IDs (defaulting to S size of default variant)
    const products = await productApi.fetchProducts();
    const sizeIdMap = new Map<number, number>(); // productId -> sizeId
    products.forEach(p => {
      if (p.rawVariants) {
        // Find S size of default/first variant
        const variant = p.rawVariants.find(
          (v: any) => (v.variantName || "Default").toLowerCase() === "default"
        ) || p.rawVariants[0];
        const sizeObj = variant?.sizes?.find((s: any) => s.sizeName === "S") || variant?.sizes?.[0];
        if (sizeObj) {
          sizeIdMap.set(p.id, sizeObj.id);
        }
      }
    });

    // Upload each local item to backend
    for (const item of localItems) {
      const sizeId = sizeIdMap.get(item.id);
      if (sizeId) {
        try {
          await wishlistApi.addToWishlist(sizeId);
        } catch (addErr) {
          console.error(`Failed to add item ${item.id} to database wishlist:`, addErr);
        }
      }
    }

    await syncWishlist();
  } catch (err) {
    console.error("Error merging wishlist on login:", err);
  }
}
