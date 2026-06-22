import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { Onboarding } from "./pages/Onboarding";
import { Profile } from "./pages/Profile";
import { Orders } from "./pages/Orders";
import { Wishlist } from "./pages/Wishlist";
import { ComingSoon } from "./pages/ComingSoon";
import { Search } from "./pages/Search";
import { About } from "./pages/About";
import { Help } from "./pages/Help";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { Returns } from "./pages/Returns";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function FooterWrapper() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  if (isHome) return null;
  return <Footer />;
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header />
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
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <FooterWrapper />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
