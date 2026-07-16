import { cartApi } from "./cart-api";
import { productApi } from "./product-api";

export async function syncCart() {
  const token = localStorage.getItem("dripdoggy_auth_token");
  if (!token) return;

  try {
    const [backendItems, products] = await Promise.all([
      cartApi.getCart(),
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

    const mappedItems = backendItems.map(item => {
      const details = sizeToDetailsMap.get(String(item.productVariantSizeId));
      const rawColor = item.variantName || "Default";
      const rawSize = item.sizeName || "S";
      const productId = details ? details.productId : item.productVariantSizeId;
      
      const mrp = details ? details.mrp : (item.price || 0);
      const price = details ? details.price : (item.price || 0);
      const discountType = details ? details.discountType : "";
      const discountValue = details ? details.discountValue : 0;
      
      return {
        id: productId,
        cartItemId: `${productId}-${rawColor.toLowerCase()}-${rawSize.toLowerCase()}`,
        productVariantSizeId: item.productVariantSizeId,
        brand: details ? details.brand : "DripDoggy",
        name: item.productName || (details ? details.name : "Product"),
        size: rawSize,
        color: rawColor,
        price: price,
        originalPrice: mrp,
        discountType,
        discountValue,
        quantity: item.quantity || 1,
        image: item.primaryImageUrl || "",
        backendId: item.id
      };
    });

    localStorage.setItem("cart", JSON.stringify(mappedItems));
    window.dispatchEvent(new Event("cart-updated"));
  } catch (err) {
    console.error("Error syncing cart with backend:", err);
  }
}

// Function to handle merging local guest cart to backend cart on login
export async function mergeLocalCartToBackend() {
  const token = localStorage.getItem("dripdoggy_auth_token");
  if (!token) return;

  try {
    const stored = localStorage.getItem("cart");
    const localItems = stored ? JSON.parse(stored) : [];
    if (localItems.length === 0) {
      // Just fetch backend cart
      await syncCart();
      return;
    }

    // Load products to resolve size IDs
    const products = await productApi.fetchProducts();
    const sizeIdMap = new Map<string, number>(); // "productId-color-size" -> sizeId
    products.forEach(p => {
      if (p.rawVariants) {
        p.rawVariants.forEach(v => {
          const colorName = (v.variantName || "Default").toLowerCase();
          if (v.sizes) {
            v.sizes.forEach((s: any) => {
              sizeIdMap.set(`${p.id}-${colorName}-${s.sizeName}`.toLowerCase(), s.id);
            });
          }
        });
      }
    });

    // Upload each local item to backend
    for (const item of localItems) {
      const key = `${item.id}-${item.color}-${item.size}`.toLowerCase();
      const sizeId = sizeIdMap.get(key);
      if (sizeId) {
        try {
          await cartApi.addToCart(sizeId, item.quantity);
        } catch (addErr) {
          console.error(`Failed to add item ${key} to database cart:`, addErr);
        }
      }
    }

    // Now clear local items and sync with database cart
    await syncCart();
  } catch (err) {
    console.error("Error merging cart on login:", err);
  }
}
