import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Home from "./pages/public/Home";
import OTP from "./pages/public/OTP";
import { Toastify } from "./utils/toastify";
import NotFound from "./components/NotFound";
import ResetPass from "./pages/public/ResetPass";
import Dashboard from "./pages/admin/Dashboard";
import { Suspense } from "react";
import CartLoading from "./components/ui/CartLoading";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import SellerPanel from "./pages/seller/SellerPanel";

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<CartLoading />}>
          {/*Suspense is used for lazy loading components, showing CartLoading while waiting */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/otp"
              element={
                <PublicRoute>
                  <OTP />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPass />
                </PublicRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/panel"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerPanel />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toastify />
    </>
  );
}

export default App;
