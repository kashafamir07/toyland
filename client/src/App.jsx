import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import BuildYourToyBox from "./pages/BuildYourToyBox";

import Wishlist from "./pages/Wishlist";
import PublicWishlist from "./pages/PublicWishlist";

import Contact from "./pages/Contact";

import ProtectedRoute from "./components/common/ProtectedRoute";

import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDiscounts from "./pages/admin/AdminDiscounts";

export default function App() {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hide storefront navbar/footer inside admin */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>

          {/* ========================= */}
          {/* PUBLIC STOREFRONT */}
          {/* ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/toy-box"
            element={<BuildYourToyBox />}
          />

          <Route
            path="/order-confirmation"
            element={<OrderConfirmation />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Public shared wishlist */}
          <Route
            path="/wishlist/:token"
            element={<PublicWishlist />}
          />


          {/* ========================= */}
          {/* PROTECTED USER PAGES */}
          {/* ========================= */}

          <Route
            path="/checkout"
            element={
            
                <Checkout />
             
            }
          />

          <Route
            path="/orders"
            element={
              
                <MyOrders />
              
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />


          {/* ========================= */}
          {/* WISHLIST */}
          {/* ========================= */}
          {/* 
              IMPORTANT:
              Wishlist is NOT protected.

              Guests can use localStorage.
              Logged-in users use MongoDB.
          */}

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />


          {/* ========================= */}
          {/* ADMIN */}
          {/* ========================= */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="products"
              element={<AdminProducts />}
            />

            <Route
              path="categories"
              element={<AdminCategories />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="discounts"
              element={<AdminDiscounts />}
            />
          </Route>

        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

    </div>
  );
}