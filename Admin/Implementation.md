# Architecture & Approach for Drip Doggy Admin Dashboard

## A. Technology Stack
Since the Admin folder is separate from the frontend, we recommend:

| Layer | Choice | Why |
| :--- | :--- | :--- |
| **Framework** | React 18 + TypeScript + Vite | Matches frontend, consistent DX |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Reuse existing component library & design patterns |
| **Routing** | React Router v7 | Same as frontend, nested layouts for sidebar |
| **State** | Zustand (lightweight) + localStorage persistence | Better than Context for complex admin state; persists to localStorage matching current mock pattern |
| **Charts** | Recharts (already in deps) | Already available, great for dashboard analytics |
| **Forms** | react-hook-form (already in deps) | Perfect for admin CRUD forms |
| **Data Tables** | TanStack Table (new dep) or custom shadcn-based table | shadcn's table is just a styled `<table>` — for sorting/filtering/pagination use `@tanstack/react-table` |

> [!TIP]
> **Recommendation**: Use the same exact stack as the frontend so you can share type definitions between projects. The frontend types (`Product`, `Order`, `AddressItem`, `WishlistItem`, `StoredUser`, `AuthUser`) should be extracted into a shared types package or duplicated cleanly.

---

## B. CMS Content Architecture (The Critical Decision)
Since currently ALL data is in localStorage / static files, here's the best approach:

> [!IMPORTANT]
> **Recommendation**: "LocalStorage-first CMS" pattern — Store homepage content as a JSON config object in localStorage under a key like `dripdoggy_cms_content`.
> 1. ✅ Matches the existing mock pattern (products are static, but can be read from localStorage overrides)
> 2. ✅ Requires no backend setup
> 3. ✅ The Admin writes to localStorage, frontend reads from it — both on same domain
> 4. ✅ Easy to migrate to a real backend later (swap localStorage calls with API calls)

### CMS Content Schema (stored in localStorage)
```typescript
interface CmsContent {
  hero: {
    slides: {
      tagline: string;
      title: string;
      description: string;
      image: string;
    }[];
    autoRotateInterval: number; // ms
  };
  categories: {
    title: string;
    image: string;
    description: string;
    route: string;
    comingSoon: boolean;
    comingSeason?: string;
  }[];
  signaturePieceIds: number[]; // references product IDs
  featuredProductFilter: {
    badge?: string;
    minRating?: number;
    maxCount: number;
  };
  footer: {
    cta: {
      tagline: string;
      title: string;
      description: string;
    };
    brand: {
      tagline: string;
      description: string;
    };
    links: {
      shop: { label: string; to: string }[];
      services: { label: string; to: string }[];
      house: { label: string; to: string }[];
    };
    social: { platform: string; url: string }[];
  };
}
```

### Frontend changes needed
The Home page components need to read from this config (with hardcoded fallbacks) instead of using hardcoded data directly. This requires modifying:
- `Hero.tsx` → read slides from CMS config
- `Categories.tsx` → read categories from CMS config
- `SignaturePieces.tsx` → read product IDs from CMS config
- `FeaturedProducts.tsx` → read filter criteria from CMS config
- `Footer.tsx` → read links/content from CMS config

---

## C. Admin Pages (based on Figma design + requirements)
```
/admin                        → Dashboard (redirect)
├── /admin/dashboard          → Analytics Overview
│   ├── KPI Cards (Revenue, Orders, Customers, Conversion)
│   ├── Revenue Chart (line, 7/30 days)
│   ├── Recent Orders (table, last 5)
│   └── Top Products (bar chart or list)
│
├── /admin/products           → Product Management
│   ├── Data table (sort, filter, search, paginate)
│   ├── Create/Edit Product Form (modal or page)
│   │   ├── Basic info (name, brand, price, compare-at price)
│   │   ├── Media (images, reorder)
│   │   ├── Variants (color variants with thumbnails)
│   │   ├── Sizes & Inventory
│   │   ├── Description & Specs (rich text)
│   │   └── Reviews (view/manage)
│   └── Bulk actions (delete, mark as sale, etc.)
│
├── /admin/orders             → Order Management
│   ├── Data table (status filter, search)
│   ├── Order Detail (items, customer info, timeline)
│   └── Status Update (Processing → Shipped → Delivered)
│
├── /admin/customers          → Customer Management
│   ├── Data table (search by name/email/phone)
│   ├── Customer Detail (profile, order history, addresses)
│   └── Notes / Activity log
│
├── /admin/content            → CMS / Homepage Editor  ← KEY PAGE
│   ├── Hero Section Editor
│   │   ├── Manage slides (add/remove/reorder)
│   │   └── Per slide: tagline, title, description, image URL
│   ├── Categories Editor
│   │   ├── Manage category cards (add/remove)
│   │   └── Per category: title, image, description, route, coming-soon toggle
│   ├── Signature Pieces Editor
│   │   └── Product picker (multi-select from product list)
│   ├── Featured Products Editor
│   │   └── Filter criteria (badge, min rating, count)
│   └── Footer Editor
│       ├── CTA section (tagline, title, description)
│       ├── Brand info (tagline, description)
│       ├── Link groups (Shop, Services, House)
│       └── Social links
│
├── /admin/analytics          → Detailed Analytics
│   ├── Sales Reports (daily/weekly/monthly)
│   ├── Product Performance
│   ├── Customer Insights
│   └── Export (CSV/PDF)
│
└── /admin/settings           → Store Settings
    ├── General (store name, currency, etc.)
    ├── Shipping (rates, free threshold, delivery fee)
    ├── Tax settings
    └── Account (admin profile)
```

---

## D. Component Tree
```
App (Admin)
├── AdminLayout
│   ├── Sidebar
│   │   ├── Logo
│   │   ├── NavItems (Dashboard, Products, Orders, Customers, Content, Analytics, Settings)
│   │   └── User info / Logout at bottom
│   ├── TopBar
│   │   ├── Breadcrumbs
│   │   ├── Search
│   │   ├── Notifications (bell icon)
│   │   └── User avatar dropdown
│   └── MainContent (Routes render here)
│
├── Shared Components (reusable)
│   ├── DataTable (generic, sortable, filterable, paginated)
│   ├── StatCard (KPI display)
│   ├── StatusBadge (Processing/Shipped/Delivered)
│   ├── EmptyState
│   ├── ConfirmDialog
│   ├── ImageUploader (URL-based for now)
│   ├── RichTextEditor (optional, or just textarea)
│   ├── ProductPicker (searchable modal to pick products)
│   └── ColorPicker (or hex input)
│
├── Dashboard Components
│   ├── KpiCards (Revenue, Orders, Customers, Conversion)
│   ├── RevenueChart (recharts LineChart)
│   ├── RecentOrdersTable
│   └── TopProductsChart
│
├── Product Components
│   ├── ProductForm (create/edit)
│   ├── VariantEditor (color variants list)
│   ├── SpecsEditor (dynamic key-value pairs)
│   └── ReviewList (read-only management)
│
├── Order Components
│   ├── OrderDetailPanel
│   ├── OrderTimeline
│   └── StatusUpdateDropdown
│
├── Customer Components
│   ├── CustomerDetailPanel
│   └── CustomerOrderHistory
│
├── CMS Components
│   ├── HeroSlideEditor (inline form per slide)
│   ├── CategoryCardEditor
│   ├── ProductSelector (modal)
│   ├── LinkGroupEditor (add/remove/reorder links)
│   └── SocialLinkEditor
│
└── Settings Components
    └── SettingsForm (general, shipping, tax tabs)
```

---

## E. Data Flow
```
┌─────────────────────────────────────────────────────┐
│                   ADMIN (localhost:5173)             │
│                                                      │
│  User edits content → Zustand store update           │
│       ↓                                              │
│  Zustand persist middleware → localStorage           │
│       ↓                                              │
│  localStorage key: "dripdoggy_admin_*"               │
│       ↓                                              │
│  Same domain (localhost) → Frontend can read it      │
└─────────────────────────────────────────────────────┘
                        │
                   same origin
                        │
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (localhost:5173)            │
│                                                      │
│  Home page mounts → reads from localStorage          │
│       ↓                                              │
│  Falls back to hardcoded defaults if empty           │
│       ↓                                              │
│  Renders with admin-edited content                   │
└─────────────────────────────────────────────────────┘
```

> [!NOTE]
> **Key insight**: Since both apps run on `localhost` during development, localStorage is shared. In production, they'd need to be on the same domain or you'd use a real backend. But for now, this works perfectly.

### Data keys in localStorage:
- `dripdoggy_products` — product catalog (admin CRUD)
- `dripdoggy_orders` — orders (admin manages)
- `dripdoggy_registered_users` — users (already exists)
- `dripdoggy_cms_content` — homepage editable content
- `dripdoggy_store_settings` — store configuration

---

## F. Routing Structure
```typescript
<Routes>
  <Route path="/" element={<AdminLayout />}>
    <Route index element={<Navigate to="dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="products/new" element={<ProductForm />} />
    <Route path="products/:id/edit" element={<ProductForm />} />
    <Route path="orders" element={<Orders />} />
    <Route path="orders/:id" element={<OrderDetail />} />
    <Route path="customers" element={<Customers />} />
    <Route path="customers/:id" element={<CustomerDetail />} />
    <Route path="content" element={<ContentManager />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
  </Route>
  <Route path="/login" element={<AdminLogin />} />
</Routes>
```

---

## G. Mock Data Generation
Since we don't have real orders/customers data with the Product-like richness:
- **Orders**: Generate 25-50 mock orders referencing products from `products.ts`
- **Customers**: Use existing users from auth-storage + generate 20-30 mock users
- **Analytics**: Derive from mock orders (revenue = sum of order totals, grouped by date)

Build helper functions in a `src/lib/mock-data.ts` file that seed this data into localStorage on first admin login.

---

## H. Implementation Order (recommended)

| Phase | What | Why First |
| :--- | :--- | :--- |
| **1** | Project scaffolding (Vite + React + Tailwind + shadcn + Router + Zustand) | Foundation |
| **2** | Admin Layout (Sidebar + TopBar + routing) | Structural skeleton |
| **3** | Auth guard (admin login, protected routes) | Security |
| **4** | Dashboard (KPIs + charts + recent orders) | Visual payoff early |
| **5** | Products CRUD (table + form + localStorage) | Core feature |
| **6** | Orders management (table + detail + status update) | Core feature |
| **7** | CMS Content Editor (hero, categories, featured, footer) | Key requirement |
| **8** | Customers management | Core feature |
| **9** | Analytics page | Nice-to-have |
| **10** | Settings page | Nice-to-have |
| **11** | Connect frontend to read CMS content from localStorage | Integration |
| **12** | Polish & responsive | Final touches |

---

## I. Data Migration Strategy for Products
Currently products are a static export from `products.ts`. For the admin to edit them:
1. On admin startup, read `products.ts` and write to localStorage key `dripdoggy_products`
2. Admin CRUD reads/writes this localStorage key
3. Frontend `products.ts` gets a new import path: instead of static data, it first checks `localStorage.getItem("dripdoggy_products")`, falling back to the hardcoded array.

This means you modify `src/app/data/products.ts` in the frontend to check localStorage first, and the admin writes to that same key.

---

## J. Product Field Changes Needed
The current `Product` interface in `products.ts` has a mix of required and optional fields. For admin CRUD, we need:
- **Add**: `category`, `tags`, `inStock`, `quantity` (inventory), `createdAt`, `updatedAt`, `status` (active/draft/archived)
- **Make consistent**: Variants should always have a thumbnail and at least one image
