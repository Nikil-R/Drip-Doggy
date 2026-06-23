import { useState } from "react";
import { Save, Store, CreditCard, Truck, Bell, Shield, Globe, Palette, Percent, Clock, AlertTriangle, ToggleLeft } from "lucide-react";

const RS = "\u20B9";

const settingSections = [
  {
    title: "Store Details",
    icon: Store,
    fields: [
      { label: "Store Name", value: "Drip Doggy", type: "text", desc: "Your public store name" },
      { label: "Store Email", value: "hello@dripdoggy.com", type: "email", desc: "Customer support email" },
      { label: "Phone", value: "+91 98765 43210", type: "tel", desc: "Customer service number" },
      { label: "Address", value: "42, Bandra West, Mumbai, Maharashtra 400050", type: "text", desc: "Registered business address" },
      { label: "GST Number", value: "27AABCU9603R1ZT", type: "text", desc: "GST registration" },
    ],
  },
  {
    title: "Payment Settings",
    icon: CreditCard,
    fields: [
      { label: "Currency", value: "INR (" + RS + ")", type: "text", desc: "Store currency" },
      { label: "Payment Gateway", value: "Razorpay", type: "text", desc: "Primary payment processor" },
      { label: "Gateway Fee (%)", value: "2.0", type: "text", desc: "Razorpay transaction fee" },
      { label: "COD Available", value: "Yes", type: "text", desc: "Cash on delivery option" },
      { label: "COD Surcharge", value: RS + "49", type: "text", desc: "Additional fee for COD orders" },
    ],
  },
  {
    title: "Shipping Configuration",
    icon: Truck,
    fields: [
      { label: "Free Shipping Above", value: RS + "2,999", type: "text", desc: "Orders above this get free shipping" },
      { label: "Standard Delivery", value: "3–5 Business Days", type: "text", desc: "Regular shipping time" },
      { label: "Express Delivery", value: "1–2 Business Days", type: "text", desc: "Premium shipping time" },
      { label: "Express Surcharge", value: RS + "199", type: "text", desc: "Additional cost for express" },
      { label: "Shipping Partner", value: "Delhivery, Blue Dart", type: "text", desc: "Courier partners" },
    ],
  },
  {
    title: "Tax Configuration",
    icon: Percent,
    fields: [
      { label: "GST Rate (%)", value: "5/12/18/28", type: "text", desc: "Applicable GST slabs" },
      { label: "HSN Code (Apparel)", value: "6204/6205", type: "text", desc: "Clothing HSN codes" },
      { label: "TDS Applicable", value: "Yes (Section 194Q)", type: "text", desc: "TDS on purchases > " + RS + "50L" },
    ],
  },
  {
    title: "Store Timings",
    icon: Clock,
    fields: [
      { label: "Business Days", value: "Monday – Saturday", type: "text", desc: "Operating days" },
      { label: "Business Hours", value: "10:00 AM – 7:00 PM", type: "text", desc: "Operating hours (IST)" },
      { label: "Order Cutoff", value: "4:00 PM IST", type: "text", desc: "Same-day dispatch cutoff" },
      { label: "Holiday List", value: "Public Holidays", type: "text", desc: "Non-shipping days" },
    ],
  },
  {
    title: "Branding & SEO",
    icon: Palette,
    fields: [
      { label: "Tagline", value: "Luxury Streetwear, Redefined.", type: "text", desc: "Store tagline" },
      { label: "Meta Title", value: "Drip Doggy — Luxury Streetwear | Mumbai", type: "text", desc: "SEO page title" },
      { label: "Meta Description", value: "Premium fashion label based in Mumbai. Crafting luxury streetwear since 2024.", type: "text", desc: "SEO meta description" },
      { label: "Store Logo URL", value: "/images/logo.png", type: "text", desc: "Path to logo asset" },
      { label: "Favicon URL", value: "/favicon.ico", type: "text", desc: "Browser tab icon" },
    ],
  },
];

export function SettingsPage() {
  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Settings</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy store configuration &amp; preferences
          </p>
        </div>
        <button className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
          <Save className="h-3.5 w-3.5" />
          Save Changes
        </button>
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Left: Settings Sections ──────────────────────────────── */}
        <div className="lg:col-span-8 space-y-5">
          {settingSections.map((section) => (
            <div key={section.title} className="bg-card border border-neutral-200/80 p-6">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 bg-card border border-neutral-200 flex items-center justify-center">
                  <section.icon className="h-4 w-4 text-neutral-500" />
                </div>
                <div>
                  <h2 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest">{section.title}</h2>
                  <p className="text-[7px] text-neutral-400 font-bold uppercase tracking-wider">Configure {section.title.toLowerCase()}</p>
                </div>
              </div>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.label} className="grid grid-cols-[160px_1fr] gap-4 items-start">
                    <div>
                      <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase block">{field.label}</label>
                      <p className="text-[6.5px] text-neutral-400 font-medium mt-0.5">{field.desc}</p>
                    </div>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full px-3 py-2 bg-card border border-neutral-200/80 text-[9px] font-bold focus:outline-none focus:border-[#030213] transition-all placeholder-neutral-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Right: Quick Actions & Zone ──────────────────────────── */}
        <div className="lg:col-span-4 space-y-5">

          {/* Quick Actions */}
          <div className="bg-card border border-neutral-200/80 p-6">
            <h2 className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Notification Preferences", icon: Bell, desc: "Email & SMS alerts" },
                { label: "Security Settings", icon: Shield, desc: "2FA & password policy" },
                { label: "Store Theme", icon: Palette, desc: "Color scheme & fonts" },
                { label: "Shipping Zones", icon: Globe, desc: "Domestic & international" },
              ].map((action) => (
                <button key={action.label}
                  className="w-full flex items-center gap-3 px-3.5 py-3 border border-neutral-100 hover:border-neutral-200 transition-colors text-left bg-transparent cursor-pointer">
                  <action.icon className="h-4 w-4 text-neutral-400 shrink-0" />
                  <div>
                    <span className="text-[8px] font-semibold text-[#030213] uppercase tracking-wider block">{action.label}</span>
                    <span className="text-[7px] text-neutral-400 font-medium">{action.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Store Status Toggle */}
          <div className="bg-card border border-neutral-200/80 p-6">
            <h2 className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">Store Status</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] font-semibold text-green-700 uppercase tracking-wider">🟢 Live</p>
                <p className="text-[7px] text-neutral-400 font-bold mt-0.5">Store is active and accepting orders</p>
              </div>
              <ToggleLeft className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2 pt-3 border-t border-neutral-100">
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-neutral-500 font-bold">Products Listed</span>
                <span className="font-bold text-[#030213]">24</span>
              </div>
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-neutral-500 font-bold">Pending Orders</span>
                <span className="font-bold text-amber-600">12</span>
              </div>
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-neutral-500 font-bold">Active Coupons</span>
                <span className="font-bold text-[#030213]">6</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card border border-neutral-200/80 p-6">
            <h2 className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2">Danger Zone</h2>
            <p className="text-[7px] text-neutral-400 font-bold mb-4">Irreversible actions — proceed with caution</p>
            <div className="space-y-2">
              <button className="w-full px-3.5 py-2.5 bg-red-50 text-red-700 border border-red-200 text-[8px] font-semibold tracking-widest uppercase hover:bg-red-100 transition-colors cursor-pointer">
                Deactivate Store
              </button>
              <button className="w-full px-3.5 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-semibold tracking-widest uppercase hover:bg-amber-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                Clear All Data
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
