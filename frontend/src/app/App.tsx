import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthModal } from "./components/auth/AuthModal";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Onboarding } from "./pages/Onboarding";
import { Profile } from "./pages/Profile";
import { Orders } from "./pages/Orders";
import { Wishlist } from "./pages/Wishlist";
import { ComingSoon } from "./pages/ComingSoon";
import { Search } from "./pages/Search";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { Returns } from "./pages/Returns";
import { ClientServices } from "./pages/ClientServices";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, hash]);

  return null;
}

function FooterWrapper() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  if (isHome) return null;
  return <Footer />;
}


export default function App() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'sync-from-admin') {
        const { key, value } = event.data;
        if (value === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
        // Notify local components
        window.dispatchEvent(new CustomEvent('dd-content-changed', { detail: { key } }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
          <AuthModal />
          <Routes>
            {/* Public Routes — no auth required for browsing */}
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Protected Routes — auth required */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/client-services" element={<ClientServices />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <FooterWrapper />
        </div>
        {/* Hidden cross-origin localStorage sync bridge for dev */}
        <iframe
          src="http://localhost:5174/admin/bridge.html"
          style={{ display: 'none', width: 0, height: 0, border: 'none' }}
          title="localstorage-bridge"
        />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
