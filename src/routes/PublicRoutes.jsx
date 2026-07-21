import Home from "../pages/public/Home";
import { Route } from "react-router-dom";
import { PublicRoute, RestrictRoles } from "./ProtectedRoute";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import OTP from "../pages/public/OTP";
import ResetPass from "../pages/public/ResetPass";
import Shop from "../pages/user/Shop";
import PublicLayout from "../layouts/PublicLayout";

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
        <RestrictRoles blockedRoles={["admin", "seller", "user"]}>
          <PublicLayout />
        </RestrictRoles>
      }
    >
      <Route
        path=""
        element={
          <PublicRoute>
            <Home selected={"home"} />{" "}
          </PublicRoute>
        }
      />
      <Route
        path="shop"
        element={
          <PublicRoute>
            <Shop selected={"home"} />{" "}
          </PublicRoute>
        }
      />
    </Route>
  </>
);

export default publicRoutes;
