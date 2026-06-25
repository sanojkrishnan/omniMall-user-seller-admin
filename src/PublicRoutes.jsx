import Home from "./pages/public/Home";
import { Route } from "react-router-dom";
import { PublicRoute, RestrictRoles } from "./components/ProtectedRoute";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import OTP from "./pages/public/OTP";
import ResetPass from "./pages/public/ResetPass";
import Shop from "./pages/user/Shop";
import PublicLayout from "./components/ui/PublicLayout";

const publicRoutes = (
  <>
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
      path="/"
      element={
        <RestrictRoles blockedRoles={["admin", "seller"]}>
          <PublicLayout />
        </RestrictRoles>
      }
    >
      <Route path="" element={<Home selected={"home"} />} />
      <Route path="shop" element={<Shop selected={"home"} />} />
    </Route>
  </>
);

export default publicRoutes;
