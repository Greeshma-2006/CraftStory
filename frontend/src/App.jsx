// ── ADD THIS IMPORT near the other page imports ───────────────────────────────
// import ProfilePage from './pages/ProfilePage';

// ── ADD THIS ROUTE inside <Routes> (after the existing admin routes) ──────────

/*
  <Route
    path="/profile"
    element={
      <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
        <ProfilePage />
      </ProtectedRoute>
    }
  />
*/

// ── FULL UPDATED App.jsx ──────────────────────────────────────────────────────

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import { Toaster }       from 'sonner';
import Navbar            from './components/common/Navbar';
import ProtectedRoute    from './ui/ProtectedRoute';
import './App.css';

// PUBLIC
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import AboutPage      from './pages/AboutPage';
import ExplorePage    from './pages/ExplorePage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import ArtisanStoryPage from './pages/ArtisanStoryPage';

// PROFILE (universal)
import ProfilePage    from './pages/ProfilePage';

// PRODUCTS
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

// CUSTOMER
import CartPage       from './pages/CartPage';
import WishlistPage   from './pages/WishlistPage';
import CustomerDashboard from './pages/CustomerDashboard';
import CurrentOrders  from './pages/CurrentOrders';
import PreviousOrders from './pages/PreviousOrders';
import CheckoutPage   from './pages/CheckoutPage';
import PaymentSuccess from './pages/PaymentSuccess';

// ARTISAN
import ArtisanDashboard    from './pages/ArtisanDashboard';
import ArtisanProfileSetup from './pages/ArtisanProfileSetup';
import ArtisanOrders       from './pages/ArtisanOrders';
import MyProducts          from './pages/MyProducts';

// ADMIN
import AdminDashboard       from './pages/AdminDashboard';
import AdminPendingRequests from './pages/AdminPendingRequests';
import AdminProfile         from './pages/AdminProfile';
import ApprovedArtisans     from './pages/ApprovedArtisans';
import RejectedArtisans     from './pages/RejectedArtisans';
import RevokedArtisans      from './pages/RevokedArtisans';
import CustomerReports      from './pages/CustomerReports';
import AdminVerifyLogin     from './pages/AdminVerifyLogin';

const AppRoutes = () => (
  <Router>
    <div className="bg-[#FFF9F3] min-h-screen">
      <Navbar />
      <Routes>

        {/* PUBLIC */}
        <Route path="/"                       element={<LandingPage />} />
        <Route path="/about"                  element={<AboutPage />} />
        <Route path="/explore"                element={<ExplorePage />} />
        <Route path="/artisan/:id"            element={<ArtisanStoryPage />} />
        <Route path="/login"                  element={<LoginPage />} />
        <Route path="/register"               element={<RegisterPage />} />
        <Route path="/forgot-password"        element={<ForgotPassword />} />
        <Route path="/reset-password/:token"  element={<ResetPassword />} />
        <Route path="/admin/verify-login/:token" element={<AdminVerifyLogin />} />

        {/* PRODUCTS */}
        <Route path="/products"     element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* UNIVERSAL PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER */}
        <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/cart"               element={<ProtectedRoute allowedRoles={['customer']}><CartPage /></ProtectedRoute>} />
        <Route path="/wishlist"           element={<ProtectedRoute allowedRoles={['customer']}><WishlistPage /></ProtectedRoute>} />
        <Route path="/checkout"           element={<ProtectedRoute allowedRoles={['customer']}><CheckoutPage /></ProtectedRoute>} />
        <Route path="/current-orders"     element={<ProtectedRoute allowedRoles={['customer']}><CurrentOrders /></ProtectedRoute>} />
        <Route path="/previous-orders"    element={<ProtectedRoute allowedRoles={['customer']}><PreviousOrders /></ProtectedRoute>} />
        <Route path="/payment-success"    element={<ProtectedRoute allowedRoles={['customer']}><PaymentSuccess /></ProtectedRoute>} />

        {/* ARTISAN */}
        <Route path="/artisan/dashboard"  element={<ProtectedRoute allowedRoles={['artisan']}><ArtisanDashboard /></ProtectedRoute>} />
        <Route path="/artisan/setup"      element={<ProtectedRoute allowedRoles={['artisan']}><ArtisanProfileSetup /></ProtectedRoute>} />
        <Route path="/artisan/orders"     element={<ProtectedRoute allowedRoles={['artisan']}><ArtisanOrders /></ProtectedRoute>} />
        <Route path="/artisan/products"   element={<ProtectedRoute allowedRoles={['artisan']}><MyProducts /></ProtectedRoute>} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/pending"   element={<ProtectedRoute allowedRoles={['admin']}><AdminPendingRequests /></ProtectedRoute>} />
        <Route path="/admin/profile"   element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/approved"  element={<ProtectedRoute allowedRoles={['admin']}><ApprovedArtisans /></ProtectedRoute>} />
        <Route path="/admin/rejected"  element={<ProtectedRoute allowedRoles={['admin']}><RejectedArtisans /></ProtectedRoute>} />
        <Route path="/admin/revoked"   element={<ProtectedRoute allowedRoles={['admin']}><RevokedArtisans /></ProtectedRoute>} />
        <Route path="/admin/reports"   element={<ProtectedRoute allowedRoles={['admin']}><CustomerReports /></ProtectedRoute>} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      <Toaster position="top-right" richColors />
    </div>
  </Router>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
