export type RefundMethod = "qr_code" | "upi" | "bank_transfer";

export interface RefundDetails {
  method: RefundMethod;
  qrCodeImage?: string; // base64 data URL
  upiId?: string;
  phoneNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface ReturnRequest {
  reason: string;
  refundDetails: RefundDetails;
  submittedAt: string;
  status: "pending" | "approved" | "completed" | "rejected";
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: "Placed" | "Processing" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled" | "Return Requested" | "Exchange Requested";
  items: {
    id?: number;
    name: string;
    brand: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
    returnRequest?: ReturnRequest;
    exchangeRequest?: any;
  }[];
  returnRequest?: ReturnRequest;
  orderTimestamp?: string;
  deliveredTimestamp?: string;
}

export interface AddressItem {
  id: number;
  type: string;
  firstName: string;
  lastName: string;
  buildingNo: string;
  buildingName: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  outOfStock?: boolean;
  backendId?: number;       // backend DB id, used for API delete
  originalPrice?: number;   // MRP before discount
  discountType?: string;
  discountValue?: number;
}
