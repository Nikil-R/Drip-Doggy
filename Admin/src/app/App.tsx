import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AdminLayout, AdminPageSkeleton } from "./components/layout/AdminLayout";

const LoginPage = lazy(() => import("./pages/Login").then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.DashboardPage })));
const ProductsPage = lazy(() => import("./pages/Products").then(m => ({ default: m.ProductsPage })));
const OrdersPage = lazy(() => import("./pages/Orders").then(m => ({ default: m.OrdersPage })));
const ReturnsPage = lazy(() => import("./pages/Returns").then(m => ({ default: m.ReturnsPage })));
const ExchangesPage = lazy(() => import("./pages/Exchanges").then(m => ({ default: m.ExchangesPage })));
const CustomersPage = lazy(() => import("./pages/Customers").then(m => ({ default: m.CustomersPage })));
const CategoriesPage = lazy(() => import("./pages/Categories").then(m => ({ default: m.CategoriesPage })));
const TransactionsPage = lazy(() => import("./pages/Transactions").then(m => ({ default: m.TransactionsPage })));
const ContentPage = lazy(() => import("./pages/ContentManager").then(m => ({ default: m.ContentPage })));
const AnalyticsPage = lazy(() => import("./pages/Analytics").then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import("./pages/Settings").then(m => ({ default: m.SettingsPage })));
const AddProductPage = lazy(() => import("./pages/AddProduct").then(m => ({ default: m.AddProductPage })));
const RolesPage = lazy(() => import("./pages/Roles").then(m => ({ default: m.RolesPage })));
const CouponCodePage = lazy(() => import("./pages/CouponCode").then(m => ({ default: m.CouponCodePage })));
const BrandPage = lazy(() => import("./pages/Brand").then(m => ({ default: m.BrandPage })));
const ProductMediaPage = lazy(() => import("./pages/ProductMedia").then(m => ({ default: m.ProductMediaPage })));
const ProductReviewsPage = lazy(() => import("./pages/ProductReviews").then(m => ({ default: m.ProductReviewsPage })));
const ControlAuthorityPage = lazy(() => import("./pages/ControlAuthority").then(m => ({ default: m.ControlAuthorityPage })));
const HeroSlidesEditorPage = lazy(() => import("./pages/HeroSlidesEditor").then(m => ({ default: m.HeroSlidesEditorPage })));
const FeaturedProductsEditorPage = lazy(() => import("./pages/FeaturedProductsEditor").then(m => ({ default: m.FeaturedProductsEditorPage })));
const SignaturePiecesEditorPage = lazy(() => import("./pages/SignaturePiecesEditor").then(m => ({ default: m.SignaturePiecesEditorPage })));
const HomeCategoriesEditorPage = lazy(() => import("./pages/HomeCategoriesEditor").then(m => ({ default: m.HomeCategoriesEditorPage })));
const NewsletterConfigEditorPage = lazy(() => import("./pages/NewsletterConfigEditor").then(m => ({ default: m.NewsletterConfigEditorPage })));
const FooterSettingsEditorPage = lazy(() => import("./pages/FooterSettingsEditor").then(m => ({ default: m.FooterSettingsEditorPage })));
const NavigationMenuEditorPage = lazy(() => import("./pages/NavigationMenuEditor").then(m => ({ default: m.NavigationMenuEditorPage })));
const SitePagesEditorPage = lazy(() => import("./pages/SitePagesEditor").then(m => ({ default: m.SitePagesEditorPage })));
const CuratedCollectionsEditorPage = lazy(() => import("./pages/CuratedCollectionsEditor").then(m => ({ default: m.CuratedCollectionsEditorPage })));
const ComingSoonEditorPage = lazy(() => import("./pages/ComingSoonEditor").then(m => ({ default: m.ComingSoonEditorPage })));
const ProfilePage = lazy(() => import("./pages/Profile").then(m => ({ default: m.ProfilePage })));
const ChangePasswordPage = lazy(() => import("./pages/ChangePassword").then(m => ({ default: m.ChangePasswordPage })));
const NewsletterCampaignPage = lazy(() => import("./pages/NewsletterCampaign").then(m => ({ default: m.NewsletterCampaignPage })));
const ProductBundlesPage = lazy(() => import("./pages/ProductBundles").then(m => ({ default: m.ProductBundlesPage })));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Public route - login */}
        <Route path="/admin/login" element={<Suspense fallback={<AdminPageSkeleton />}><LoginPage /></Suspense>} />

        {/* Protected routes wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<AddProductPage />} />
          <Route path="products/edit/:id" element={<AddProductPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="exchanges" element={<ExchangesPage />} />
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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="newsletter-campaign" element={<NewsletterCampaignPage />} />
          <Route path="product-bundles" element={<Suspense fallback={<AdminPageSkeleton />}><ProductBundlesPage /></Suspense>} />

          {/* Content Editor Routes */}
          <Route path="content/hero-slides" element={<HeroSlidesEditorPage />} />
          <Route path="content/featured-products" element={<FeaturedProductsEditorPage />} />
          <Route path="content/signature-pieces" element={<SignaturePiecesEditorPage />} />
          <Route path="content/home-categories" element={<HomeCategoriesEditorPage />} />
          <Route path="content/newsletter" element={<NewsletterConfigEditorPage />} />
          <Route path="content/footer" element={<FooterSettingsEditorPage />} />
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
