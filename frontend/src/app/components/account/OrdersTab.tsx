import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, CheckCircle, Truck, Eye, Printer, X, QrCode, Smartphone, Banknote, Upload, AlertCircle, RefreshCw, Palette, Tag, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { printInvoice, printBill } from "../../lib/invoice";
import type { Order, RefundDetails, RefundMethod } from "../../types/account";
import { orderApi } from "../../lib/order-api";
import { productApi } from "../../lib/product-api";

// Mock Product catalog to fetch sizes & colors for exchanges
const VARIANT_CATALOG: Record<string, { sizes: string[]; colors: { name: string; price: number }[] }> = {
  "Vanguard Tactical Vest": {
    sizes: ["Small", "Medium", "Large", "X-Large"],
    colors: [
      { name: "Stealth Black", price: 185.00 },
      { name: "Olive Drab", price: 195.00 },
      { name: "Sand Tan", price: 175.00 }
    ]
  },
  "Heavyweight Hoodie": {
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Sandstone", price: 300.00 },
      { name: "Charcoal Grey", price: 320.00 },
      { name: "Off White", price: 290.00 }
    ]
  },
  "Structured Canvas Jacket": {
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Navy Blue", price: 5800.00 },
      { name: "Sage Green", price: 5800.00 }
    ]
  }
};



function getProductDetails(itemName: string, availableProducts: any[]) {
  const dynamicProd = availableProducts.find(p => p.name.toLowerCase() === itemName.toLowerCase());
  if (dynamicProd && dynamicProd.rawVariants) {
    const colors = dynamicProd.rawVariants.map((v: any) => ({
      name: v.variantName || v.colorName || "Default",
      price: Number(v.price || v.mrp),
      sizes: (v.sizes || []).map((s: any) => s.sizeName)
    }));
    const allSizes = Array.from(new Set(
      dynamicProd.rawVariants.flatMap((v: any) => (v.sizes || []).map((s: any) => s.sizeName))
    )) as string[];
    return {
      sizes: allSizes,
      colors: colors
    };
  }

  const fallback = VARIANT_CATALOG[itemName];
  if (fallback) {
    return {
      sizes: fallback.sizes,
      colors: fallback.colors.map(c => ({
        name: c.name,
        price: c.price,
        sizes: fallback.sizes
      }))
    };
  }

  return {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Default", price: 0, sizes: ["XS", "S", "M", "L", "XL", "XXL"] }
    ]
  };
}

function getTargetVariantId(itemName: string, selectedColor: string, originalColor: string, availableProducts: any[]): number | undefined {
  const dynamicProd = availableProducts.find(p => p.name.toLowerCase() === itemName.toLowerCase());
  if (dynamicProd && dynamicProd.rawVariants) {
    const targetColor = selectedColor || originalColor;
    const matchingVariant = dynamicProd.rawVariants.find(
      (v: any) => (v.variantName || v.colorName || "").toLowerCase() === targetColor.toLowerCase()
    );
    if (matchingVariant) {
      return matchingVariant.id;
    }
  }
  return undefined;
}

// Converts backend snake_case/UPPER_SNAKE status strings into human-readable "Title Case" display labels.
// Optionally strips a known prefix (e.g. "RETURN_" or "EXCHANGE_") before formatting.
function formatStatusLabel(raw: string, stripPrefix?: string): string {
  if (!raw) return "";
  let str = raw.toUpperCase();
  if (stripPrefix && str.startsWith(stripPrefix.toUpperCase())) {
    str = str.slice(stripPrefix.length);
  }
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getTimelineSteps(order: Order, datePlaced: string) {
  const rawDeliveryStatus = ((order as any).rawDeliveryStatus || "").toUpperCase();
  // Unified stage key from returnReq (set during mapping) takes priority
  const returnReqRaw = ((order.returnRequest as any)?.rawDeliveryStatus || "").toUpperCase();
  // Use the unified stage key if available, otherwise fallback to order raw
  const effectiveRaw = returnReqRaw || rawDeliveryStatus;

  const isReturn =
    effectiveRaw.startsWith("RETURN_") ||
    effectiveRaw === "OUT_FOR_PICKUP" ||
    effectiveRaw === "RECEIVED_AT_WAREHOUSE" ||
    effectiveRaw === "REFUND_COMPLETED" ||
    order.status === "Return Requested" ||
    !!order.returnRequest;
  const isExchange = rawDeliveryStatus.startsWith("EXCHANGE_") || order.status === "Exchange Requested" || !!(order as any).exchangeRequest;

  if (isReturn) {
    // All 5 admin stages mapped to boolean flags:
    // RETURN_INITIATED → RETURN_APPROVED → OUT_FOR_PICKUP → RECEIVED_AT_WAREHOUSE → REFUND_COMPLETED
    const isInitiated = true;
    const isApproved =
      order.returnRequest?.status === "approved" ||
      order.returnRequest?.status === "completed" ||
      effectiveRaw === "RETURN_APPROVED" ||
      effectiveRaw === "OUT_FOR_PICKUP" ||
      effectiveRaw === "RECEIVED_AT_WAREHOUSE" ||
      effectiveRaw === "REFUND_COMPLETED" ||
      effectiveRaw === "RETURN_PICKUPED" ||
      effectiveRaw === "RETURN_SHIPPED" ||
      effectiveRaw === "RETURN_OUT_OF_DELIVERY" ||
      effectiveRaw === "RETURN_DELIVERED";
    const isPickedup =
      effectiveRaw === "OUT_FOR_PICKUP" ||
      effectiveRaw === "RECEIVED_AT_WAREHOUSE" ||
      effectiveRaw === "REFUND_COMPLETED" ||
      effectiveRaw === "RETURN_PICKUPED" ||
      effectiveRaw === "RETURN_SHIPPED" ||
      effectiveRaw === "RETURN_OUT_OF_DELIVERY" ||
      effectiveRaw === "RETURN_DELIVERED";
    const isReceived =
      effectiveRaw === "RECEIVED_AT_WAREHOUSE" ||
      effectiveRaw === "REFUND_COMPLETED" ||
      effectiveRaw === "RETURN_SHIPPED" ||
      effectiveRaw === "RETURN_OUT_OF_DELIVERY" ||
      effectiveRaw === "RETURN_DELIVERED";
    const isCompleted =
      effectiveRaw === "REFUND_COMPLETED" ||
      effectiveRaw === "RETURN_DELIVERED" ||
      order.returnRequest?.status === "completed";

    return [
      { title: "Return Initiated", description: "Return request submitted", date: datePlaced, done: isInitiated },
      { title: "Return Approved", description: "Request approved by warehouse", date: isApproved ? "Approved" : "Pending", done: isApproved },
      { title: "Out for Pickup", description: "Courier pickup agent assigned", date: isPickedup ? "In Progress" : "Pending", done: isPickedup },
      { title: "Received at Warehouse", description: "Undergoing quality inspection", date: isReceived ? "In Progress" : "Pending", done: isReceived },
      { title: "Refund Completed", description: "Refund sent back to payment source", date: isCompleted ? "Completed" : "Pending", done: isCompleted }
    ];
  }

  if (isExchange) {
    const isInitiated = true;
    const isApproved =
      (order as any).exchangeRequest?.status === "approved" ||
      (order as any).exchangeRequest?.status === "completed" ||
      rawDeliveryStatus === "EXCHANGE_PICKUPED" ||
      rawDeliveryStatus === "EXCHANGE_SHIPPED" ||
      rawDeliveryStatus === "EXCHANGE_OUT_OF_DELIVERY" ||
      rawDeliveryStatus === "EXCHANGE_DELIVERED";
    const isPickedup =
      rawDeliveryStatus === "EXCHANGE_PICKUPED" ||
      rawDeliveryStatus === "EXCHANGE_SHIPPED" ||
      rawDeliveryStatus === "EXCHANGE_OUT_OF_DELIVERY" ||
      rawDeliveryStatus === "EXCHANGE_DELIVERED";
    const isReceived =
      rawDeliveryStatus === "EXCHANGE_SHIPPED" ||
      rawDeliveryStatus === "EXCHANGE_OUT_OF_DELIVERY" ||
      rawDeliveryStatus === "EXCHANGE_DELIVERED";
    const isDispatched =
      rawDeliveryStatus === "EXCHANGE_OUT_OF_DELIVERY" ||
      rawDeliveryStatus === "EXCHANGE_DELIVERED";
    const isCompleted = rawDeliveryStatus === "EXCHANGE_DELIVERED" || (order as any).exchangeRequest?.status === "completed";

    return [
      { title: "Exchange Initiated", description: "Exchange request submitted", date: datePlaced, done: isInitiated },
      { title: "Exchange Approved", description: "Request approved by warehouse", date: isApproved ? "Approved" : "Pending", done: isApproved },
      { title: "Package Picked Up", description: "Courier picked up your package", date: isPickedup ? "In Transit" : "Pending", done: isPickedup },
      { title: "In Transit", description: "Package on the way to warehouse", date: isReceived ? "In Transit" : "Pending", done: isReceived },
      { title: "Out for Delivery", description: "Out for delivery to our warehouse", date: isDispatched ? "Arriving" : "Pending", done: isDispatched },
      { title: "Delivered to Warehouse", description: "Package received at warehouse", date: isCompleted ? "Completed" : "Pending", done: isCompleted }
    ];
  }

  const isDelivered = order.status === "Delivered";
  const isOutForDelivery = order.status === "Out for Delivery" || isDelivered;
  const isShipped = order.status === "Shipped" || isOutForDelivery;
  const isPacked = order.status === "Packed" || isShipped;
  const isProcessing = order.status === "Processing" || isPacked;
  const isPlaced = order.status === "Placed" || isProcessing;
  return [
    { title: "Placed", description: "Your order has been received", date: datePlaced, done: isPlaced },
    { title: "Processing", description: "Item is being prepared", date: isProcessing ? datePlaced : "Pending", done: isProcessing },
    { title: "Packed", description: "Item picked and packed", date: isPacked ? datePlaced : "Pending", done: isPacked },
    { title: "Shipped", description: "In transit with carrier", date: isShipped ? "06 June 2026" : "Pending", done: isShipped },
    { title: "Out for Delivery", description: "Delivery driver is en route", date: isOutForDelivery ? "08 June 2026" : "Pending", done: isOutForDelivery },
    { title: "Delivered", description: "Package dropped off safely", date: isDelivered ? "08 June 2026" : "Pending", done: isDelivered },
  ];
}

function isWithinReturnWindow(deliveredTimestampStr?: string): boolean {
  if (!deliveredTimestampStr) return false;
  const deliveredTime = new Date(deliveredTimestampStr).getTime();
  if (isNaN(deliveredTime)) return false;
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - deliveredTime;
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return timeDifference < twentyFourHours;
}

export function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [defectFiles, setDefectFiles] = useState<File[]>([]);
  const [qrFile, setQrFile] = useState<File | null>(null);

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const prodList = await productApi.fetchProducts();
        setAvailableProducts(prodList || []);
      } catch (err) {
        console.error("Failed to load products for exchanges:", err);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    async function loadStorefrontOrders() {
      try {
        const orderHistory = await orderApi.getCustomerOrders();
        const mappedOrders: Order[] = orderHistory.map(oh => {
          let mappedPayment: "Paid" | "Unpaid" | "Refunded" = "Unpaid";
          if (oh.paymentStatus === "PAID" || oh.paymentStatus === "COMPLETED") mappedPayment = "Paid";
          else if (oh.paymentStatus === "REFUNDED") mappedPayment = "Refunded";

          let mappedStatus = oh.deliveryStatus || "Placed";
          const rawStatus = (oh.deliveryStatus || "Placed").toUpperCase();

          // Helper: is this order in a return logistics flow?
          const isReturnFlow =
            rawStatus.startsWith("RETURN_") ||
            rawStatus === "OUT_FOR_PICKUP" ||
            rawStatus === "RECEIVED_AT_WAREHOUSE" ||
            rawStatus === "REFUND_COMPLETED";

          // Map backend deliveryStatus to friendly frontend order status
          if (rawStatus === "DELIVERED") mappedStatus = "Delivered";
          else if (rawStatus === "CANCELLED" || rawStatus === "CANCELED") mappedStatus = "Cancelled";
          else if (rawStatus === "PLACED") mappedStatus = "Placed";
          else if (rawStatus === "PROCESSING") mappedStatus = "Processing";
          else if (rawStatus === "PACKED") mappedStatus = "Packed";
          else if (rawStatus === "SHIPPED") mappedStatus = "Shipped";
          else if (rawStatus === "OUT_FOR_DELIVERY") mappedStatus = "Out for Delivery";
          // Treat all return-related statuses as "Return Requested"
          else if (isReturnFlow) mappedStatus = "Return Requested";
          // Treat all exchange-related statuses as "Exchange Requested"
          else if (rawStatus.startsWith("EXCHANGE_")) mappedStatus = "Exchange Requested";
          else mappedStatus = oh.deliveryStatus?.charAt(0).toUpperCase() + (oh.deliveryStatus?.slice(1).toLowerCase() || "");

          // Build returnRequest from deliveryStatus if it's a return order
          let returnReq = null;
          let exchangeReq = null;

          if (isReturnFlow) {
            // Map backend raw delivery status → unified return stage key
            // Admin stages: RETURN_INITIATED → RETURN_APPROVED → OUT_FOR_PICKUP → RECEIVED_AT_WAREHOUSE → REFUND_COMPLETED
            let approvalStatus = "pending";
            let unifiedRawStatus = rawStatus;
            if (rawStatus === "RETURN_APPROVED" || rawStatus === "RETURN_ACCEPTED") {
              approvalStatus = "approved";
              unifiedRawStatus = "RETURN_APPROVED";
            } else if (rawStatus === "OUT_FOR_PICKUP" || rawStatus === "RETURN_PICKUPED") {
              approvalStatus = "approved";
              unifiedRawStatus = "OUT_FOR_PICKUP";
            } else if (rawStatus === "RECEIVED_AT_WAREHOUSE" || rawStatus === "RETURN_SHIPPED" || rawStatus === "RETURN_OUT_OF_DELIVERY") {
              approvalStatus = "approved";
              unifiedRawStatus = "RECEIVED_AT_WAREHOUSE";
            } else if (rawStatus === "REFUND_COMPLETED" || rawStatus === "RETURN_DELIVERED") {
              approvalStatus = "completed";
              unifiedRawStatus = "REFUND_COMPLETED";
            }
            returnReq = {
              reason: oh.returnRequest?.cancelReason || oh.returnRequest?.reason || "Return requested",
              status: approvalStatus,
              submittedAt: oh.returnRequest?.createdAt || "",
              rawDeliveryStatus: unifiedRawStatus
            };
          } else if (oh.returnRequest) {
            returnReq = {
              reason: oh.returnRequest.cancelReason || oh.returnRequest.reason || "",
              status: oh.returnRequest.status?.toLowerCase() || "pending",
              submittedAt: oh.returnRequest.createdAt || "",
              rawDeliveryStatus: rawStatus
            };
          }

          if (rawStatus.startsWith("EXCHANGE_")) {
            let approvalStatus = "pending";
            if (rawStatus === "EXCHANGE_PICKUPED" || rawStatus === "EXCHANGE_SHIPPED" || rawStatus === "EXCHANGE_OUT_OF_DELIVERY") {
              approvalStatus = "approved";
            } else if (rawStatus === "EXCHANGE_DELIVERED") {
              approvalStatus = "completed";
            }
            exchangeReq = {
              reason: "Exchange requested",
              status: approvalStatus,
              submittedAt: "",
              rawDeliveryStatus: rawStatus
            };
          } else if (oh.exchangeRequest) {
            exchangeReq = {
              reason: oh.exchangeRequest.cancelReason || oh.exchangeRequest.reason || "",
              status: oh.exchangeRequest.status?.toLowerCase() || "pending",
              submittedAt: oh.exchangeRequest.createdAt || "",
              rawDeliveryStatus: rawStatus
            };
          }

          const hasAnyItemRequest = (oh.items || []).some((item: any) => item.returnRequestType);

          // Map items returned from backend (after returnReq/exchangeReq are populated)
          const itemsList = (oh.items || []).map((item: any) => {
            let itemReturnReq = null;
            let itemExchangeReq = null;

            const rawItemType = item.returnRequestType || ""; // "RETURN" or "EXCHANGE"
            const rawItemStatus = item.returnRequestStatus || ""; // "PENDING", "APPROVED", etc.

            if (rawItemType === "RETURN") {
              itemReturnReq = {
                reason: "",
                status: rawItemStatus.toLowerCase(),
                submittedAt: "",
                rawDeliveryStatus: rawStatus.startsWith("RETURN_") ? rawStatus : "RETURN_" + rawItemStatus
              };
            } else if (rawItemType === "EXCHANGE") {
              itemExchangeReq = {
                reason: "",
                status: rawItemStatus.toLowerCase(),
                submittedAt: "",
                rawDeliveryStatus: rawStatus.startsWith("EXCHANGE_") ? rawStatus : "EXCHANGE_" + rawItemStatus
              };
            } else if (!hasAnyItemRequest) {
              itemReturnReq = returnReq;
              itemExchangeReq = exchangeReq;
            }

            return {
              id: item.id,
              name: item.name || "Unknown Product",
              brand: "CONCRETE CULTURE",
              size: item.size || "M",
              color: item.sku || item.color || "Default",
              price: Number(item.price || 0),
              quantity: Number(item.qty || item.quantity || 1),
              image: item.image || item.imageUrl || "",
              returnRequest: itemReturnReq,
              exchangeRequest: itemExchangeReq
            };
          });

          // Fallback if item list is empty
          if (itemsList.length === 0) {
            itemsList.push({
              name: "Structured Canvas Jacket",
              brand: "CONCRETE CULTURE",
              size: "M",
              color: "Navy Blue",
              price: oh.totalAmount,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
            });
          }

          return {
            id: oh.orderNumber,
            date: oh.orderTimestamp?.split("T")?.[0] || oh.orderTimestamp?.split(" ")?.[0] || "2026-07-08",
            total: oh.totalAmount,
            status: mappedStatus,
            items: itemsList,
            returnRequest: returnReq as any,
            exchangeRequest: exchangeReq as any,
            rawDeliveryStatus: rawStatus as any,
            orderTimestamp: oh.orderTimestamp,
            deliveredTimestamp: oh.deliveredTimestamp,
            shippingFee: oh.shippingFee || 0,
            discount: oh.discount || 0,
            platformFee: oh.platformFee || 0
          };
        });

        setOrders(mappedOrders);
      } catch (err) {
        console.error("Failed to load storefront order history:", err);
      }
    }
    loadStorefrontOrders();
  }, [user]);

  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Return/Exchange Request State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [requestType, setRequestType] = useState<"return" | "exchange">("return");
  const [flowStep, setFlowStep] = useState(1);
  const [reason, setReason] = useState("Defective / Damaged");
  const [otherReasonText, setOtherReasonText] = useState("");
  
  // Track selective items
  const [selectedItemIds, setSelectedItemIds] = useState<Record<number, boolean>>({});
  const [returnQuantities, setReturnQuantities] = useState<Record<number, number>>({});
  const [exchangeSizes, setExchangeSizes] = useState<Record<number, string>>({});
  const [exchangeColors, setExchangeColors] = useState<Record<number, string>>({});
  
  // Max 3 optional defect/payout details images
  const [defectImages, setDefectImages] = useState<string[]>([]);

  // Exchange Variant selectors
  const [selectedExchangeSize, setSelectedExchangeSize] = useState("");
  const [selectedExchangeColor, setSelectedExchangeColor] = useState("");
  
  // Payout refund methods
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("qr_code");
  const [refundDetails, setRefundDetails] = useState<Partial<RefundDetails>>({});
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ items?: string; images?: string }>({});

  const profile = {
    firstName: user?.firstName || "Customer",
    lastName: user?.lastName || "",
    email: user?.email || "customer@email.com",
    phone: user?.phone || "",
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        await orderApi.cancelOrder(orderId, "Customer request");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
      } catch (e) {
        console.error("Failed to cancel order on backend:", e);
      }
    }
  };

  const handleOpenRequestModal = (order: Order, type: "return" | "exchange") => {
    setSelectedOrder(order);
    setRequestType(type);
    setFlowStep(1);
    setReason("Defective / Damaged");
    setOtherReasonText("");
    setRefundMethod("qr_code");
    setRefundDetails({});
    setQrPreview(null);
    setDefectImages([]);
    setDefectFiles([]);
    setQrFile(null);

    setValidationErrors({});

    const itemsSelection: Record<number, boolean> = {};
    const itemsQty: Record<number, number> = {};
    const excSizes: Record<number, string> = {};
    const excColors: Record<number, string> = {};
    const excTypes: Record<number, "size_only" | "color_only" | "color_and_size"> = {};

    order.items.forEach(item => {
      itemsSelection[item.id] = false;
      itemsQty[item.id] = item.quantity;
      excTypes[item.id] = "size_only";

      const details = getProductDetails(item.name, availableProducts);
      // Default color should be current item color
      excColors[item.id] = item.color;
      // Default size should be another size if available in the same color, otherwise same size
      const currentVariant = details.colors.find(c => c.name.toLowerCase() === item.color.toLowerCase());
      const otherSizes = currentVariant ? currentVariant.sizes.filter((s: string) => s !== item.size) : [];
      excSizes[item.id] = otherSizes.length > 0 ? otherSizes[0] : item.size;
    });

    setSelectedItemIds(itemsSelection);
    setReturnQuantities(itemsQty);
    setExchangeSizes(excSizes);
    setExchangeColors(excColors);
  };

  // Prevent background scrolling when Return/Exchange modal is active
  useEffect(() => {
    if (selectedOrder) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedOrder]);

  const handleDefectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB limit

    const availableSlots = 3 - defectImages.length;
    const incomingFiles = Array.from(files);

    // Validate type and size for each incoming file
    const validFiles: File[] = [];
    for (const file of incomingFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" has an unsupported format. Please upload JPEG, PNG, or WebP images.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        alert(`File "${file.name}" exceeds the 3MB size limit. Please upload a smaller image.`);
        return;
      }
      validFiles.push(file);
    }

    const filesToUpload = validFiles.slice(0, availableSlots);

    setDefectFiles(prev => [...prev, ...filesToUpload]);

    filesToUpload.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDefectImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDefectImage = (indexToRemove: number) => {
    setDefectImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setDefectFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB limit

    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported format. Please upload a JPEG, PNG, or WebP image for your QR Code.");
      return;
    }
    if (file.size > maxSizeBytes) {
      alert("The QR Code image exceeds the 3MB size limit.");
      return;
    }

    setQrFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setQrPreview(base64);
      setRefundDetails(prev => ({ ...prev, qrCodeImage: base64 }));
    };
    reader.readAsDataURL(file);
  };


  const handleSubmitRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOrder) return;

    const selectedItemsToProcess = selectedOrder.items.filter(item => selectedItemIds[item.id]);
    const hasSelectedItems = selectedItemsToProcess.length > 0;
    const hasImages = defectImages.length > 0;

    const errors: { items?: string; images?: string } = {};
    if (!hasSelectedItems) {
      errors.items = `Please select at least one product to ${requestType === "return" ? "return" : "exchange"}.`;
    }
    if (!hasImages) {
      errors.images = "Uploading at least 1 defect/verification photo is mandatory.";
    }

    if (requestType === "exchange" && hasSelectedItems) {
      const sameVariantSelected = selectedItemsToProcess.some(item => {
        const targetColor = exchangeColors[item.id] || item.color;
        const targetSize = exchangeSizes[item.id] || item.size;
        return targetColor.toLowerCase() === item.color.toLowerCase() && targetSize === item.size;
      });
      if (sameVariantSelected) {
        errors.items = "You must select a different color or size. Exchanging for the exact same item is not allowed.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const finalReason = reason === "Other" ? `Other: ${otherReasonText}` : reason;

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (requestType === "return") {
        if (refundMethod === "qr_code" && !refundDetails.qrCodeImage) {
          alert("Please upload your UPI QR Code image.");
          setIsSubmitting(false);
          return;
        }
        if (refundMethod === "upi" && !refundDetails.upiId && !refundDetails.phoneNumber) {
          alert("Please fill in either your UPI ID or Phone Number.");
          setIsSubmitting(false);
          return;
        }
        if (refundMethod === "bank_transfer") {
          const { accountHolderName, bankName, accountNumber, ifscCode } = refundDetails;
          if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
            alert("Please fill in all bank transfer fields.");
            setIsSubmitting(false);
            return;
          }
        }

        // Call backend API return submission for each selected item
        for (const item of selectedItemsToProcess) {
          const qty = returnQuantities[item.id] || 1;
          await orderApi.submitReturn(
            selectedOrder.id,
            item.id,
            qty,
            finalReason,
            defectFiles,
            refundMethod,
            {
              ...refundDetails,
              qrCodeFile: qrFile
            }
          );
        }

        const returnReq = {
          reason: finalReason,
          refundDetails: { method: refundMethod, ...refundDetails },
          defectImages,
          submittedAt: new Date().toLocaleString(),
          status: "pending"
        };

        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "Return Requested", returnRequest: returnReq as any, rawDeliveryStatus: "RETURN_INITIATED" } : o));
        setToastMessage("Return request submitted successfully. Our team will review your defect images and complete your refund.");
      } else if (requestType === "exchange") {
        // Call backend API exchange submission for each selected item
        for (const item of selectedItemsToProcess) {
          const qty = returnQuantities[item.id] || 1;
          const targetSize = exchangeSizes[item.id] || item.size;
          const targetVariantId = getTargetVariantId(item.name, exchangeColors[item.id], item.color, availableProducts) || item.id;
          
          await orderApi.submitExchange(
            selectedOrder.id,
            item.id,
            finalReason,
            defectFiles,
            qty,
            targetSize,
            targetVariantId
          );
        }

        const exchangeReq = {
          reason: finalReason,
          originalSize: selectedItemsToProcess[0]?.size,
          requestedSize: exchangeSizes[selectedItemsToProcess[0]?.id] || selectedItemsToProcess[0]?.size,
          originalColor: selectedItemsToProcess[0]?.color,
          requestedColor: exchangeColors[selectedItemsToProcess[0]?.id] || selectedItemsToProcess[0]?.color,
          adjustmentAmount: 0,
          refundDetails: null,
          defectImages,
          submittedAt: new Date().toLocaleString(),
          status: "pending"
        };

        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "Exchange Requested", exchangeRequest: exchangeReq as any, rawDeliveryStatus: "EXCHANGE_INITIATED" } : o));
        setToastMessage("Exchange request submitted successfully. Our logistics partner will coordinate pickup.");
      }
    } catch (err: any) {
      console.error("Failed to submit request to backend:", err);
      const serverMessage = err.response?.data?.message || err.response?.data || err.message;
      alert(`Error submitting request: ${serverMessage}`);
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);
    }

    // Unconditionally close the modal and reset steps
    setSelectedOrder(null);
    setFlowStep(1);
    setDefectImages([]);
    setQrPreview(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 6000);
  };
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[120] bg-[#030213] text-white border border-[#b2533e] px-6 py-4 shadow-2xl max-w-sm">
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#b2533e] mb-1">Request Received</p>
          <p className="text-[9.5px] text-neutral-300 font-semibold leading-relaxed">
            {toastMessage}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
        <Package className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
        <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 p-16 text-center">
          <Package className="h-12 w-12 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
          <h2 className="text-sm font-extrabold tracking-[0.15em] uppercase mb-2">No Orders Yet</h2>
          <p className="text-[11px] text-neutral-500 font-medium mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const withinWindow = isWithinReturnWindow(order.deliveredTimestamp);
            const hasReturn = !!order.returnRequest;
            const hasExchange = !!(order as any).exchangeRequest;
            
            return (
              <div key={order.id} className="bg-white border border-neutral-200/85 shadow-xs transition-shadow hover:shadow-sm">
                
                {/* Responsive Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-neutral-50/50 border-b border-neutral-200/60">
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-4 text-[10px] font-bold tracking-wider">
                    <div>
                      <span className="text-[7.5px] font-black tracking-[0.15em] text-neutral-400 uppercase block mb-0.5">Order ID</span>
                      <span className="text-[#030213] font-black">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black tracking-[0.15em] text-neutral-400 uppercase block mb-0.5">Placed On</span>
                      <span className="text-neutral-600 font-medium">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black tracking-[0.15em] text-neutral-400 uppercase block mb-0.5">Total Paid</span>
                      <span className="text-[#030213] font-black font-mono">₹{order.total.toFixed(0)}</span>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center self-start sm:self-center">
                    {order.status === "Delivered" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-200/60">
                        <CheckCircle className="h-3 w-3" /> Delivered
                      </span>
                    ) : order.status === "Cancelled" ? (
                      <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-200/60">
                        Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200/60">
                        <Truck className="h-3 w-3" /> {order.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Block */}
                <div className="divide-y divide-neutral-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 px-5 py-4">
                      <div className="w-16 h-20 bg-neutral-50 border border-neutral-200/50 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <span className="text-[7.5px] font-black tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                        <h4 className="text-[12.5px] font-black text-[#030213] uppercase mt-0.5 tracking-tight truncate">{item.name}</h4>
                        <p className="text-[9.5px] text-neutral-500 font-bold uppercase tracking-wider mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                          <span>Size: <strong className="text-[#030213]">{item.size}</strong></span>
                          <span className="text-neutral-300">|</span>
                          <span>Color: <strong className="text-[#030213]">{item.color}</strong></span>
                          <span className="text-neutral-300">|</span>
                          <span>Qty: <strong className="text-[#030213]">{item.quantity}</strong></span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="text-[13px] font-black text-[#030213] pt-0.5 font-mono">₹{(item.price * item.quantity).toFixed(0)}</span>
                        {item.returnRequest ? (
                          <span className="px-2 py-0.5 text-[7px] font-black uppercase tracking-widest bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                            {(() => {
                              const raw = ((item.returnRequest as any).rawDeliveryStatus || "").toUpperCase();
                              const st = ((item.returnRequest as any).status || "").toUpperCase();
                              if (st === "COMPLETED" || st === "REFUND_COMPLETED" || raw === "REFUND_COMPLETED" || raw === "RETURN_DELIVERED") return "Refund Completed";
                              if (raw === "RECEIVED_AT_WAREHOUSE" || raw === "RETURN_SHIPPED" || raw === "RETURN_OUT_OF_DELIVERY") return "At Warehouse";
                              if (raw === "OUT_FOR_PICKUP" || raw === "RETURN_PICKUPED") return "Out for Pickup";
                              if (st === "APPROVED" || raw === "RETURN_APPROVED" || raw === "RETURN_ACCEPTED") return "Return Approved";
                              return "Return Initiated";
                            })()}
                          </span>
                        ) : (item as any).exchangeRequest ? (
                          <span className="px-2 py-0.5 text-[7px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                            Exchange: {(() => {
                              const ex = (item as any).exchangeRequest;
                              const rawDel = ((ex?.rawDeliveryStatus || "") as string).toUpperCase();
                              const st = ((ex?.status || "") as string).toUpperCase();
                              if (st === "COMPLETED" || st === "EXCHANGE_COMPLETED" || rawDel === "EXCHANGE_DELIVERED") return "Completed";
                              if (st === "REPLACEMENT_UNAVAILABLE") return "Size Unavailable";
                              if (rawDel === "EXCHANGE_PICKUPED") return "Out for Pickup";
                              if (rawDel === "EXCHANGE_SHIPPED") return "At Warehouse";
                              if (rawDel === "EXCHANGE_PACKED" || rawDel === "EXCHANGE_OUT_OF_DELIVERY") return "Replacement Placed";
                              if (st === "APPROVED" || st === "RECEIVED" || rawDel === "EXCHANGE_INITIATED") return "Approved";
                              return "Pending";
                            })()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Responsive Action Buttons Container */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-4 bg-neutral-50/20 border-t border-neutral-200/60">
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="flex items-center justify-center gap-1.5 bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-4 py-2 text-[9px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> Track order
                  </button>
                  
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                    {/* Cancellation Action (Allowed strictly before Packed stage) */}
                    {(order.status === "Placed" || order.status === "Processing") && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-white border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    {/* Return & Exchange Actions (Hidden if either returnRequest OR exchangeRequest exists) */}
                    {order.status === "Delivered" && !hasReturn && !hasExchange && withinWindow && (
                      <>
                        <button 
                          onClick={() => handleOpenRequestModal(order, "return")}
                          className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer"
                        >
                          Return
                        </button>
                        <button 
                          onClick={() => handleOpenRequestModal(order, "exchange")}
                          className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer"
                        >
                          Exchange
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => printInvoice(order, profile)}
                      className="bg-[#030213] hover:bg-neutral-800 text-white px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" /> Invoice
                    </button>
                    <button
                      onClick={() => printBill(order, profile)}
                      className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" /> Bill
                    </button>
                  </div>
                </div>

                {/* Unavailability Choice UI */}
                {order.items.some((i: any) => i.exchangeRequest?.status?.toUpperCase() === "REPLACEMENT_UNAVAILABLE") && (
                  <div className="bg-red-50/50 border-t border-red-100 p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-2 text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Exchange Size Unavailable</p>
                        <p className="text-[9.5px] font-semibold mt-1 opacity-90">The replacement size you requested is currently out of stock. How would you like to proceed?</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={async () => {
                          const itemWithReq = order.items.find((i: any) => i.exchangeRequest?.status?.toUpperCase() === "REPLACEMENT_UNAVAILABLE");
                          if (!itemWithReq) return;
                          try {
                            await orderApi.handleUnavailabilityChoice((itemWithReq as any).exchangeRequest.id, "REFUND");
                            alert("Successfully converted to refund.");
                            window.location.reload();
                          } catch (e) {
                            alert("Failed to submit choice.");
                          }
                        }}
                        className="flex-1 bg-white border border-red-200 hover:bg-red-50 text-red-700 py-2.5 text-[9px] font-black tracking-widest uppercase cursor-pointer"
                      >
                        Request Refund
                      </button>
                      <button 
                        onClick={async () => {
                          const itemWithReq = order.items.find((i: any) => i.exchangeRequest?.status?.toUpperCase() === "REPLACEMENT_UNAVAILABLE");
                          if (!itemWithReq) return;
                          try {
                            await orderApi.handleUnavailabilityChoice((itemWithReq as any).exchangeRequest.id, "KEEP_ORIGINAL");
                            alert("Successfully cancelled exchange. You will keep your original items.");
                            window.location.reload();
                          } catch (e) {
                            alert("Failed to submit choice.");
                          }
                        }}
                        className="flex-1 bg-red-700 hover:bg-red-800 text-white border-none py-2.5 text-[9px] font-black tracking-widest uppercase cursor-pointer"
                      >
                        Keep Original Items
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Return & Exchange Request Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-5 right-5 text-neutral-400 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer">
              <X className="h-4 w-4 stroke-[1.5]" />
            </button>
            <div>
              <span className="text-[7px] font-black tracking-[0.2em] text-[#b2533e] uppercase">Order {selectedOrder.id}</span>
              <h2 className="text-base font-extrabold tracking-[0.1em] uppercase mt-0.5">
                {requestType === "return" ? "Submit Return Request" : "Submit Exchange Request"}
              </h2>
            </div>

            <div className="flex items-center justify-center gap-4 text-[9px] font-extrabold uppercase tracking-wider border-b border-neutral-100 pb-4">
              <span className={flowStep === 1 ? "text-[#b2533e]" : "text-neutral-400"}>1. Selection & Reason</span>
              {requestType === "return" && (
                <>
                  <span className="text-neutral-300">/</span>
                  <span className={flowStep === 2 ? "text-[#b2533e]" : "text-neutral-400"}>2. Refund Details</span>
                </>
              )}
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              {flowStep === 1 ? (
                <div className="space-y-4">
                  {/* Product Selection Questions */}
                  <div className="space-y-3">
                    <label className="block text-[9.5px] font-extrabold tracking-[0.1em] uppercase text-neutral-800">
                      Which product do you want to {requestType === "return" ? "return" : "exchange"}?
                    </label>
                    <div className="space-y-3 divide-y divide-neutral-100 max-h-[220px] overflow-y-auto pr-1">
                      {selectedOrder.items.map((item) => {
                        const isChecked = !!selectedItemIds[item.id];
                        const quantityOptions = Array.from({ length: item.quantity }, (_, i) => i + 1);
                        
                        return (
                          <div key={item.id} className="pt-3 first:pt-0 space-y-2.5">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                id={`select-item-${item.id}`}
                                checked={isChecked}
                                onChange={(e) => {
                                  setSelectedItemIds(prev => ({
                                    ...prev,
                                    [item.id]: e.target.checked
                                  }));
                                }}
                                className="mt-1 cursor-pointer accent-[#030213]"
                              />
                              <label htmlFor={`select-item-${item.id}`} className="flex flex-1 gap-3 cursor-pointer select-none">
                                <div className="w-12 h-16 bg-neutral-50 border border-neutral-200/50 overflow-hidden flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[11px] font-black text-[#030213] uppercase truncate">{item.name}</h4>
                                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                                    Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                  </p>
                                  <p className="text-[10px] font-extrabold text-[#030213] mt-0.5 font-mono">₹{item.price}</p>
                                </div>
                              </label>
                            </div>

                            {isChecked && (
                              <div className="pl-6 space-y-3">
                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between gap-4">
                                  <label className="text-[8px] font-black tracking-widest uppercase text-neutral-400">Qty to {requestType === "return" ? "Return" : "Exchange"}</label>
                                  <select
                                    value={returnQuantities[item.id] || 1}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10);
                                      setReturnQuantities(prev => ({ ...prev, [item.id]: val }));
                                    }}
                                    className="bg-white border border-neutral-200 px-2 py-1 text-[9px] font-bold focus:outline-none focus:border-[#030213]"
                                  >
                                    {quantityOptions.map(q => (
                                      <option key={q} value={q}>{q}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Exchange Variant Selectors */}
                                {requestType === "exchange" && (() => {
                                  const details = getProductDetails(item.name, availableProducts);
                                  const selectedColor = exchangeColors[item.id] || item.color;
                                  
                                  const allColors = details.colors;
                                  const variantConfig = details.colors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());
                                  const availableSizesForColor = variantConfig ? variantConfig.sizes : details.sizes;

                                  return (
                                    <div className="border border-neutral-100 p-3 bg-neutral-50/50 space-y-3">
                                      <p className="text-[8px] font-black tracking-widest text-[#030213] uppercase">Select Replacement Variant</p>
                                      
                                      {/* Color selection dropdown */}
                                      <div>
                                        <label className="flex items-center gap-1 text-[7.5px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">
                                          Color / Style
                                        </label>
                                        <select
                                          value={selectedColor}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setExchangeColors(prev => ({ ...prev, [item.id]: val }));
                                            
                                            const newColorConfig = details.colors.find(c => c.name.toLowerCase() === val.toLowerCase());
                                            const newColorSizes = newColorConfig ? newColorConfig.sizes : details.sizes;
                                            setExchangeSizes(prev => ({ ...prev, [item.id]: newColorSizes.includes(item.size) ? item.size : newColorSizes[0] || item.size }));
                                          }}
                                          className="w-full bg-white border border-neutral-200 px-2.5 py-1.5 text-[9px] font-bold focus:outline-none focus:border-[#030213]"
                                        >
                                          {allColors.length > 0 ? allColors.map(c => {
                                            const isCurrentColor = c.name.toLowerCase() === item.color.toLowerCase();
                                            return (
                                              <option key={c.name} value={c.name} disabled={isCurrentColor}>
                                                {c.name} {isCurrentColor ? "(Current)" : ""}
                                              </option>
                                            );
                                          }) : (
                                            <option value={item.color}>{item.color} (No other colors available)</option>
                                          )}
                                        </select>
                                      </div>

                                      {/* Size selection dropdown */}
                                      <div>
                                        <label className="flex items-center gap-1 text-[7.5px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">
                                          Size
                                        </label>
                                        <select
                                          value={exchangeSizes[item.id] || item.size}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setExchangeSizes(prev => ({ ...prev, [item.id]: val }));
                                          }}
                                          className="w-full bg-white border border-neutral-200 px-2.5 py-1.5 text-[9px] font-bold focus:outline-none focus:border-[#030213]"
                                        >
                                          {availableSizesForColor.length > 0 ? availableSizesForColor.map((s: string) => {
                                            const isOriginalColor = selectedColor.toLowerCase() === item.color.toLowerCase();
                                            const isCurrentSize = isOriginalColor && s === item.size;
                                            return (
                                              <option key={s} value={s} disabled={isCurrentSize}>
                                                {s} {isCurrentSize ? "(Current)" : ""}
                                              </option>
                                            );
                                          }) : (
                                            <option value={item.size}>{item.size} (No sizes available)</option>
                                          )}
                                        </select>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {validationErrors.items && (
                      <p className="text-[10px] font-bold text-red-600 mt-1">{validationErrors.items}</p>
                    )}
                  </div>


                  {/* Reason Dropdown */}
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2">
                      Reason for {requestType === "return" ? "Return" : "Exchange"}
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                    >
                      <option value="Defective / Damaged">Defective / Damaged</option>
                      {requestType === "exchange" && (
                        <option value="Wrong Size Ordered">Wrong Size Ordered</option>
                      )}
                      <option value="Color Discrepancy">Color Discrepancy</option>
                      <option value="Not as Described">Not as Described</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {reason === "Other" && (
                    <div>
                      <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2">Details</label>
                      <textarea
                        value={otherReasonText}
                        onChange={(e) => setOtherReasonText(e.target.value)}
                        placeholder="Elaborate your reason..."
                        rows={3}
                        required
                        className="w-full bg-white border border-neutral-200 p-3 text-[10px] font-medium focus:outline-none focus:border-[#030213]"
                      />
                    </div>
                  )}

                  {/* Optional Image Uploader (Max 3 Images) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500">
                        Upload Defect / Verification Photos
                      </label>
                      <span className="text-[7.5px] text-neutral-400 font-bold uppercase">{defectImages.length} / 3 Uploaded</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {defectImages.map((img, idx) => (
                        <div key={idx} className="aspect-square border border-neutral-200 relative bg-neutral-50 rounded-sm overflow-hidden group">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveDefectImage(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity border-none cursor-pointer text-[8px] font-bold uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {defectImages.length < 3 && (
                        <label className="aspect-square border-2 border-dashed border-neutral-200 hover:border-[#030213] flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50 rounded-sm">
                          <Camera className="w-4 h-4 text-neutral-400" />
                          <span className="text-[6.5px] text-neutral-500 font-extrabold uppercase mt-1">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleDefectImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    {validationErrors.images && (
                      <p className="text-[10px] font-bold text-red-600 mt-1">{validationErrors.images}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const selectedItemsToProcess = selectedOrder.items.filter(item => selectedItemIds[item.id]);
                      const hasSelectedItems = selectedItemsToProcess.length > 0;
                      const hasImages = defectImages.length > 0;

                      const errors: { items?: string; images?: string } = {};
                      if (!hasSelectedItems) {
                        errors.items = `Please select at least one product to ${requestType === "return" ? "return" : "exchange"}.`;
                      }
                      if (!hasImages) {
                        errors.images = "Uploading at least 1 defect/verification photo is mandatory.";
                      }

                      if (Object.keys(errors).length > 0) {
                        setValidationErrors(errors);
                        return;
                      }
                      setValidationErrors({});

                      if (requestType === "return") {
                        setFlowStep(2);
                      } else {
                        handleSubmitRequest();
                      }
                    }}
                    className="w-full bg-[#030213] text-white py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase border-none hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    {requestType === "return" ? "Next Step" : "Submit Request"}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2.5">
                      Select Refund Payout Option
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["qr_code", "upi", "bank_transfer"] as RefundMethod[]).map((method) => {
                        const icon = method === "qr_code" ? <QrCode className="h-4 w-4" /> : method === "upi" ? <Smartphone className="h-4 w-4" /> : <Banknote className="h-4 w-4" />;
                        const label = method === "qr_code" ? "QR Code" : method === "upi" ? "UPI ID" : "Bank";
                        const isSel = refundMethod === method;
                        return (
                          <button
                            type="button"
                            key={method}
                            onClick={() => { setRefundMethod(method); setRefundDetails({}); }}
                            className={`p-3 border flex flex-col items-center gap-1.5 transition-all text-center rounded-none cursor-pointer ${
                              isSel ? "border-[#030213] bg-[#030213]/5 text-[#030213]" : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                            }`}
                          >
                            {icon}
                            <span className="text-[8px] font-extrabold uppercase tracking-widest">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {refundMethod === "qr_code" && (
                    <div className="space-y-2">
                      <span className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500">Upload UPI QR Code Image</span>
                      <div className="border border-dashed border-neutral-200 p-4 flex flex-col items-center justify-center cursor-pointer relative bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                        <input type="file" accept="image/*" onChange={handleQrUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        {qrPreview ? (
                          <img src={qrPreview} alt="QR Preview" className="w-24 h-24 object-contain border border-neutral-200" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-neutral-400 mb-1" />
                            <span className="text-[9px] text-neutral-500 font-semibold uppercase">Click or Drag Image to Upload</span>
                            <span className="text-[7.5px] text-neutral-400 mt-0.5">PNG, JPG formats</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {refundMethod === "upi" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={refundDetails.upiId || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, upiId: e.target.value }))}
                          placeholder="e.g. name@paytm"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      <div className="relative flex py-1.5 items-center justify-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100" /></div>
                        <span className="relative bg-white px-2 text-[8px] font-bold text-neutral-400 uppercase">Or</span>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">UPI Registered Phone Number</label>
                        <input
                          type="text"
                          value={refundDetails.phoneNumber || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="e.g. +91 9876543210"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                    </div>
                  )}

                  {refundMethod === "bank_transfer" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">Account Holder Name</label>
                        <input
                          type="text"
                          value={refundDetails.accountHolderName || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                          required
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={refundDetails.bankName || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, bankName: e.target.value }))}
                          required
                          placeholder="e.g. HDFC Bank"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={refundDetails.ifscCode || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                          required
                          placeholder="e.g. HDFC0001234"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={refundDetails.accountNumber || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                          required
                          placeholder="e.g. 50100239482910"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFlowStep(1)}
                      className="w-1/2 bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-1/2 bg-[#030213] hover:bg-neutral-800 disabled:bg-neutral-400 text-white py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase transition-colors cursor-pointer border-none flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] border border-neutral-200/80 max-w-md w-full p-8 relative shadow-2xl">
            <button onClick={() => setTrackingOrder(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer">
              <X className="h-4 w-4 stroke-[1.5]" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Truck className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
              <h2 className="text-base font-extrabold tracking-[0.1em] uppercase">
                {trackingOrder.status === "Return Requested" || trackingOrder.returnRequest || trackingOrder.status === "Exchange Requested" || (trackingOrder as any).exchangeRequest
                  ? "Track Return Logistics"
                  : "Track Shipment"}
              </h2>
            </div>
            <p className="text-[8px] font-extrabold tracking-widest text-neutral-400 uppercase mb-6">
              Order: {trackingOrder.id} | Carrier: DripExpress
            </p>
            <div className="space-y-5 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-300">
              {getTimelineSteps(trackingOrder, trackingOrder.date).map((step, idx) => (
                <div key={idx} className="flex gap-4 relative items-start">
                  <div className={`w-[19px] h-[19px] flex items-center justify-center text-[7px] font-extrabold z-10 border ${
                    step.done ? "bg-[#030213] text-white border-[#030213]" : "bg-white text-neutral-400 border-neutral-300"
                  }`}>
                    {step.done ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-px">
                    <div className="flex justify-between items-baseline">
                      <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${step.done ? "text-[#030213]" : "text-neutral-400"}`}>{step.title}</h4>
                      <span className="text-[7px] font-bold text-neutral-400 uppercase">{step.date}</span>
                    </div>
                    <p className="text-[9px] text-neutral-500 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-5 border-t border-neutral-200 flex justify-between items-center text-[8px] font-extrabold tracking-widest text-neutral-500 uppercase">
              <span>Status: <span className="text-blue-600">{trackingOrder.status}</span></span>
              <span>Est: 10 June 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
