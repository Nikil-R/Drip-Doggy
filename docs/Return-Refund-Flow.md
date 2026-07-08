# Return & Refund Flow — Complete Specification

## Overview

This document describes the complete **Return & Refund** flow for Drip Doggy, covering both the **Storefront (User/Customer)** side and the **Admin Panel** side. No backend API changes are required — all data is managed via localStorage / in-memory state.

---

## Part 1: Order Lifecycle & Button Visibility

### Order Status Timeline

| Status | Cancel Button | Return Button | Refund Button |
|--------|:---:|:---:|:---:|
| **Pending** | ✅ Visible | ❌ Hidden | ❌ Hidden |
| **Processing** | ✅ Visible | ❌ Hidden | ❌ Hidden |
| **Shipped** | ❌ Hidden | ❌ Hidden | ❌ Hidden |
| **Delivered** | ❌ Hidden | ✅ Visible — "Return" | ❌ Hidden (handled by admin) |

### Current Code Logic (OrdersTab.tsx — Storefront)

In `frontend/src/app/components/account/OrdersTab.tsx`, change the action buttons section to:

```tsx
// Action button logic:
{order.status === "Pending" || order.status === "Processing" ? (
  <button onClick={handleCancel}>Cancel</button>
) : order.status === "Delivered" ? (
  <button onClick={handleReturn}>Return</button>
) : null}
```

- **Cancel** is only for orders that haven't shipped yet
- **Return** is only for orders that have been delivered
- **Shipped** orders show neither button (in transit, nothing to do)

---

## Part 2: Storefront — Return Request Modal (Frontend)

### File: `frontend/src/app/types/account.ts`

Add these new types:

```typescript
export type RefundMethod = "qr_code" | "upi" | "bank_transfer";

export interface RefundDetails {
  method: RefundMethod;
  // QR Code
  qrCodeImage?: string; // base64 data URL
  // UPI
  upiId?: string;
  phoneNumber?: string;
  // Bank Transfer
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export interface ReturnRequest {
  orderId: string;
  reason: string;
  refundDetails: RefundDetails;
  submittedAt: string;
  status: "pending" | "approved" | "completed" | "rejected";
}

// Update the Order type to include return info:
export interface OrderStatus {
  // ... existing fields ...
  returnRequest?: ReturnRequest;
}
```

### File: `frontend/src/app/components/account/OrdersTab.tsx`

#### New Component: ReturnRequestModal

When the user clicks **"Return"** on a delivered order, show a modal with:

**Step 1: Reason for Return**
- Dropdown/select with options:
  - Defective / Damaged
  - Wrong Size
  - Not as Described
  - Changed Mind
  - Other (text input)

**Step 2: Refund Method Selection** (radio buttons)
The customer chooses ONE of three options:

---

**Option 1: QR Code Image**
```
○ QR Code Image
   [Drop or click to upload QR code image]
   Supported: PNG, JPG
   (Customer uploads their UPI QR code — e.g., GPay/PhonePe/Paytm QR)
```

- File upload area (drag & drop + click)
- Preview of uploaded image
- Stores as base64 data URL in `refundDetails.qrCodeImage`

**Option 2: UPI ID / Phone Number**
```
○ UPI ID
   UPI ID:  [example@paytm                    ]
   Phone:   [+91 9876543210                   ]
```

- Two text inputs: UPI ID and phone number
- At least one must be filled

**Option 3: Bank Transfer**
```
○ Bank Transfer
   Account Holder Name:  [_________________________]
   Bank Name:            [_________________________]
   Account Number:       [_________________________]
   IFSC Code:            [_________________________]
```

- All four fields required

---

**Step 3: Submit**
- [Cancel] [Submit Return Request]
- On submit, save the return request to the order data (localStorage)
- Show success toast/message

### Flow Diagram (Storefront)

```
Customer goes to Account → Order History
             │
             ▼
  Sees delivered order with "Return" button
             │
             ▼
  Clicks "Return" → Return Request Modal opens
             │
             ├─ Step 1: Select Reason (dropdown)
             ├─ Step 2: Select Refund Method & Fill Details
             │   ├─ QR Code Upload (image)
             │   ├─ UPI ID + Phone
             │   └─ Bank Transfer (all 4 fields)
             │
             ▼
  Clicks "Submit Return Request"
             │
             ▼
  Success message: "Return request submitted. Our team will review
  and process your refund within 3-5 business days."
             │
             ▼
  Order now shows: "Return Requested" badge instead of "Return" button
  (to prevent duplicate submissions)
```

---

## Part 3: Admin Side — Processing Returns

### File: `Admin/src/app/pages/Orders.tsx`

#### A. New Interface Types

Add to the existing interfaces:

```typescript
type RefundMethod = "qr_code" | "upi" | "bank_transfer";

interface CustomerRefundDetails {
  method: RefundMethod;
  // QR Code
  qrCodeImage?: string;
  // UPI
  upiId?: string;
  phoneNumber?: string;
  // Bank Transfer
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

interface ReturnRequest {
  reason: string;
  refundDetails: CustomerRefundDetails;
  submittedAt: string;
  status: "pending" | "approved" | "completed" | "rejected";
}

// Add to Order interface:
returnRequest?: ReturnRequest;
```

#### B. Add "Return Requested" Status

Add `"Return Requested"` as a new order status option. This status appears when:
- A customer has submitted a return request (from storefront)
- The admin has not yet processed it

Add to the `status` union type:
```typescript
status: "Delivered" | "Shipped" | "Processing" | "Pending" | "Cancelled" | "Return Requested";
```

Add to `StatusBadge`:
```typescript
"Return Requested": "bg-purple-50 text-purple-700 border-purple-200",
```

Add icon for Return Requested status: Use `ArrowLeftRight` or `RotateCcw` icon.

#### C. Orders Table — New Column

Add a new column or badge in the table row for orders that have `returnRequest`:

```tsx
{order.returnRequest && (
  <span className="text-[7px] font-bold text-purple-700 bg-purple-50 
    border border-purple-200 px-1.5 py-0.5 tracking-widest mt-1 inline-block rounded">
    Return: {order.returnRequest.status.toUpperCase()}
  </span>
)}
```

#### D. Order Detail Modal — Show Return Request Info

In the order detail modal, add a new section **below "Financial Actions"** that shows pending return request info:

```tsx
{/* Return Request Section */}
{activeOrderDetails.returnRequest && (
  <div className="mt-3">
    <span className="text-[7.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-2">
      Return Request
    </span>
    <div className="border border-purple-200/80 p-4 bg-purple-50/30 rounded-sm space-y-3">
      
      {/* Return Reason */}
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[8px] font-bold text-purple-700 uppercase tracking-wider">
            Reason for Return
          </p>
          <p className="text-[10px] font-semibold text-[#382d24] mt-0.5">
            {activeOrderDetails.returnRequest.reason}
          </p>
        </div>
      </div>

      {/* Refund Method Display */}
      <div className="border-t border-purple-200/60 pt-3">
        <p className="text-[8px] font-bold text-purple-700 uppercase tracking-wider mb-2">
          Refund Method Selected
        </p>
        
        {activeOrderDetails.returnRequest.refundDetails.method === "qr_code" && (
          <div>
            <p className="text-[9px] font-bold text-[#382d24] mb-2">
              QR Code Image — Scan to pay:
            </p>
            <img 
              src={activeOrderDetails.returnRequest.refundDetails.qrCodeImage} 
              alt="Customer's UPI QR Code" 
              className="w-40 h-40 border border-neutral-300"
            />
          </div>
        )}

        {activeOrderDetails.returnRequest.refundDetails.method === "upi" && (
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[8px] text-neutral-500 font-bold">UPI ID:</span>
              <span className="text-[10px] font-bold text-[#382d24] font-mono">
                {activeOrderDetails.returnRequest.refundDetails.upiId}
              </span>
            </div>
            {activeOrderDetails.returnRequest.refundDetails.phoneNumber && (
              <div className="flex justify-between">
                <span className="text-[8px] text-neutral-500 font-bold">Phone:</span>
                <span className="text-[10px] font-bold text-[#382d24]">
                  {activeOrderDetails.returnRequest.refundDetails.phoneNumber}
                </span>
              </div>
            )}
          </div>
        )}

        {activeOrderDetails.returnRequest.refundDetails.method === "bank_transfer" && (
          <div className="border border-[#224870]/20 bg-white rounded-sm divide-y divide-neutral-200/60">
            <DetailRow label="Account Holder" value={activeOrderDetails.returnRequest.refundDetails.accountHolderName} />
            <DetailRow label="Bank Name" value={activeOrderDetails.returnRequest.refundDetails.bankName} />
            <DetailRow label="Account Number" value={maskAccountNumber(activeOrderDetails.returnRequest.refundDetails.accountNumber)} />
            <DetailRow label="IFSC Code" value={activeOrderDetails.returnRequest.refundDetails.ifscCode} />
          </div>
        )}
        
        <p className="text-[7.5px] text-neutral-400 font-semibold mt-2">
          Submitted: {activeOrderDetails.returnRequest.submittedAt}
        </p>
      </div>

      {/* Action Buttons for Admin */}
      {activeOrderDetails.returnRequest.status === "pending" && (
        <div className="border-t border-purple-200/60 pt-3 flex gap-2">
          <button onClick={handleApproveReturn(order.id)}
            className="bg-green-600 hover:bg-green-700 text-white text-[8.5px] 
              font-bold tracking-widest px-4 py-2 uppercase cursor-pointer 
              border-none rounded-sm transition-all flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Refund
          </button>
          <button onClick={handleRejectReturn(order.id)}
            className="border border-red-300 text-red-600 hover:bg-red-50 
              text-[8.5px] font-bold tracking-widest px-4 py-2 uppercase 
              cursor-pointer rounded-sm transition-all flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      )}

      {/* Status badge for non-pending */}
      {activeOrderDetails.returnRequest.status === "completed" && (
        <div className="flex items-center gap-2 text-green-700 border-t border-purple-200/60 pt-3">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">
            Refund Completed — Amount credited via {activeOrderDetails.returnRequest.refundDetails.method === "qr_code" ? "UPI QR" : activeOrderDetails.returnRequest.refundDetails.method === "upi" ? "UPI Transfer" : "Bank Transfer"}
          </span>
        </div>
      )}
      {activeOrderDetails.returnRequest.status === "rejected" && (
        <div className="flex items-center gap-2 text-red-600 border-t border-purple-200/60 pt-3">
          <XCircle className="w-4 h-4" />
          <span className="text-[9px] font-bold uppercase tracking-wider">
            Return Request Rejected
          </span>
        </div>
      )}
    </div>
  </div>
)}
```

#### E. Refund Processing Flow (Admin)

When admin clicks **"Approve & Refund"**:

1. A confirmation modal appears (similar to the existing refund modal)
2. Shows the customer's refund details (QR / UPI / Bank)
3. Admin verifies and confirms the transfer
4. On confirmation:
   - `returnRequest.status` → `"completed"`
   - `payment` → `"Refunded"`
   - `status` → `"Cancelled"` (or keep as "Return Requested" if preferred)

When admin clicks **"Reject"**:
1. A confirmation modal appears with a reason input
2. `returnRequest.status` → `"rejected"`

---

## Part 4: Data Flow Summary

```
STOREFRONT                              ADMIN
─────────                               ─────
Customer clicks "Return"                 
        │                                    
        ▼                                    
Return Modal opens                          
  - Reason dropdown                         
  - Refund method + details                 
        │                                    
        ▼                                    
Saves to localStorage:                      
  order.returnRequest = {                   
    reason, refundDetails,                  
    submittedAt, status: "pending"           
  }                                         
        │                                    
        └──────────────►  Admin opens order detail modal
                                  │
                                  ▼
                          Sees "Return Request" section
                                  │
                          ┌───────┴───────┐
                          ▼               ▼
                   Approve & Refund    Reject
                          │               │
                          ▼               ▼
                   payment→"Refunded"  returnStatus
                   status→"Cancelled"  →"rejected"
                   returnStatus
                   →"completed"
```

---

## Part 5: Sample Seed Data (Admin)

Add to `initialOrders` in `Admin/src/app/pages/Orders.tsx`:

```typescript
{
  no: 8,
  id: "#DD-7012",
  customer: "Maya Joshi",
  email: "maya.joshi@gmail.com",
  phone: "+91 98877 66554",
  date: "2026-06-18",
  payment: "Paid",
  status: "Return Requested",
  delivery: "Jaipur, RJ",
  addressLine1: "B-45, Civil Lines",
  addressLine2: "Sector 6",
  city: "Jaipur",
  state: "Rajasthan",
  postalCode: "302001",
  country: "India",
  deliveryPhone: "+91 91122 33445",
  returnRequest: {
    reason: "Wrong Size — Ordered M, fits too large",
    refundDetails: {
      method: "bank_transfer",
      accountHolderName: "Maya Joshi",
      bankName: "ICICI Bank",
      accountNumber: "45678901234",
      ifscCode: "ICIC0005678"
    },
    submittedAt: "2026-06-20 09:15",
    status: "pending"
  },
  items: [
    { name: "Ribbed Panel Dress", sku: "DD-RPD-001", size: "M", qty: 1, price: 3900, image: "..." }
  ]
},
{
  no: 9,
  id: "#DD-7123",
  customer: "Rohan Desai",
  email: "rohan.d@gmail.com",
  phone: "+91 92233 44556",
  date: "2026-06-15",
  payment: "Paid",
  status: "Return Requested",
  delivery: "Ahmedabad, GJ",
  addressLine1: "12, Riverfront Apartments",
  addressLine2: "Nehru Nagar",
  city: "Ahmedabad",
  state: "Gujarat",
  postalCode: "380001",
  country: "India",
  deliveryPhone: "+91 97788 66554",
  returnRequest: {
    reason: "Defective Item — Zipper broken",
    refundDetails: {
      method: "upi",
      upiId: "rohan.d@paytm",
      phoneNumber: "+91 92233 44556"
    },
    submittedAt: "2026-06-17 14:30",
    status: "pending"
  },
  items: [
    { name: "Structured Canvas Jacket", sku: "DD-STR-001", size: "L", qty: 1, price: 5800, image: "..." }
  ]
}
```

---

## Implementation Checklist

### Storefront (`frontend/src/app/`)

- [ ] `types/account.ts` — Add `RefundMethod`, `RefundDetails`, `ReturnRequest` types, add `returnRequest` to `Order`
- [ ] `components/account/OrdersTab.tsx`:
  - [ ] Fix Cancel button logic (only show for Pending/Processing, not Shipped)
  - [ ] Create `ReturnRequestModal` component with 3-step form
  - [ ] Step 1: Return reason dropdown
  - [ ] Step 2: Refund method selection (QR / UPI / Bank)
  - [ ] Step 3: Submit & save to localStorage
  - [ ] Show "Return Requested" badge after submission
  - [ ] Disable Return button after request is submitted

### Admin (`Admin/src/app/pages/Orders.tsx`)

- [ ] Add `RefundMethod`, `CustomerRefundDetails`, `ReturnRequest` types
- [ ] Add `"Return Requested"` to order status union + StatusBadge
- [ ] Add sample seed orders with `returnRequest` data
- [ ] Add Return Request section in order detail modal (shows reason + refund method details)
- [ ] Add "Approve & Refund" / "Reject" buttons for pending returns
- [ ] Add confirmation modals for approve/reject actions
- [ ] On approve: update payment to "Refunded", returnStatus to "completed"
- [ ] On reject: update returnStatus to "rejected"
- [ ] Show "Refund Completed" or "Rejected" badge for processed returns

---

## UI/UX Notes

1. **Storefront Colors**: Use the existing brand palette — `#030213` (dark), `#b2533e` (accent red), neutral grays
2. **Admin Colors**: Use the existing admin palette — `#224870` (navy), `#382d24` (brown), with purple `#7c3aed` for return-related accents
3. **Refund method icons**: Use `Banknote` for bank, `Smartphone` for UPI, `QrCode` (or `Camera`) for QR code — all from lucide-react
4. **Mobile responsive**: Modal should be full-screen on mobile with proper scrolling
