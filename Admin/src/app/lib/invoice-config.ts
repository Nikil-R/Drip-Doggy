// ─── DripDoggy Invoice Configuration ───────────────────────────────────
// Shared company info used across invoice/print templates.
// Source: Admin Settings page, brand guidelines.

export const INVOICE_CONFIG = {
  company: {
    name: "DRIPDOGGY",
    tagline: "Drip your way, Every day",
    description: "Architectural silhouettes, premium fabrication, uncompromised street luxury.",
    address: "42, Bandra West, Mumbai, Maharashtra 400050",
    email: "support.dripdoggy@gmail.com",
    phone: "+91 98765 43210",
    website: "www.dripdoggy.com",
    gstin: "",
  },
  defaults: {
    taxRate: 0.18, // 18% GST
    currency: "₹",
    currencyCode: "INR",
    deliveryFee: 0,
    deliveryLabel: "FREE",
  },
  terms: {
    returnPolicy: "Returns accepted within 7 days of delivery.",
    paymentNote: "This is a computer-generated tax invoice.",
    support: "For support: hello@dripdoggy.com | +91 98765 43210",
  },
  print: {
    pageMargin: "12mm",
    sheetMaxWidth: 820,
    fontFamily: `Inter, "Segoe UI", Arial, sans-serif`,
  },
};
