import Home from "./pages/public/Home";
import { Route } from "react-router-dom";
import { PublicRoute } from "./components/ProtectedRoute";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import OTP from "./pages/public/OTP";
import ResetPass from "./pages/public/ResetPass";

const publicRoutes = (
  <>
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
  </>
);

export default publicRoutes;
