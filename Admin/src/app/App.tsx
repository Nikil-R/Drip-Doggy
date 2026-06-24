import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AdminLayout } from "./components/layout/AdminLayout";
import { LoginPage } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";
import { ProductsPage } from "./pages/Products";
import { OrdersPage } from "./pages/Orders";
import { CustomersPage } from "./pages/Customers";
import { CategoriesPage } from "./pages/Categories";
import { TransactionsPage } from "./pages/Transactions";
import { ContentPage } from "./pages/ContentManager";
import { AnalyticsPage } from "./pages/Analytics";
import { SettingsPage } from "./pages/Settings";
import { AddProductPage } from "./pages/AddProduct";
import { RolesPage } from "./pages/Roles";
import { CouponCodePage } from "./pages/CouponCode";
import { BrandPage } from "./pages/Brand";
import { ProductMediaPage } from "./pages/ProductMedia";
import { ProductReviewsPage } from "./pages/ProductReviews";
import { ControlAuthorityPage } from "./pages/ControlAuthority";
import { HeroSlidesEditorPage } from "./pages/HeroSlidesEditor";
import { FeaturedProductsEditorPage } from "./pages/FeaturedProductsEditor";
import { SignaturePiecesEditorPage } from "./pages/SignaturePiecesEditor";
import { HomeCategoriesEditorPage } from "./pages/HomeCategoriesEditor";
import { NewsletterConfigEditorPage } from "./pages/NewsletterConfigEditor";
import { FooterSettingsEditorPage } from "./pages/FooterSettingsEditor";
import { NavigationMenuEditorPage } from "./pages/NavigationMenuEditor";
import { SitePagesEditorPage } from "./pages/SitePagesEditor";
import { CuratedCollectionsEditorPage } from "./pages/CuratedCollectionsEditor";
import { ComingSoonEditorPage } from "./pages/ComingSoonEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - login */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected routes wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/edit/:id" element={<AddProductPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="coupons" element={<CouponCodePage />} />
          <Route path="brands" element={<BrandPage />} />
          <Route path="products/media" element={<ProductMediaPage />} />
          <Route path="products/reviews" element={<ProductReviewsPage />} />
          <Route path="authority" element={<ControlAuthorityPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Content Editor Routes */}
          <Route path="content/hero-slides" element={<HeroSlidesEditorPage />} />
          <Route path="content/featured-products" element={<FeaturedProductsEditorPage />} />
          <Route path="content/signature-pieces" element={<SignaturePiecesEditorPage />} />
          <Route path="content/home-categories" element={<HomeCategoriesEditorPage />} />
          <Route path="content/newsletter" element={<NewsletterConfigEditorPage />} />
          <Route path="content/footer" element={<FooterSettingsEditorPage />} />
          <Route path="content/navigation" element={<NavigationMenuEditorPage />} />
          <Route path="content/site-pages" element={<SitePagesEditorPage />} />
          <Route path="content/collections" element={<CuratedCollectionsEditorPage />} />
          <Route path="content/coming-soon" element={<ComingSoonEditorPage />} />
        </Route>

        {/* Catch-all redirect to admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
