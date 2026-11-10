import { Route } from "react-router-dom";
import SellerDashboard from "../pages/seller/SellerDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import SellerLayout from "../layouts/SellerLayout";

const sellerRoutes = (
  <Route
    path="/seller"
    element={
      <ProtectedRoute allowedRoles={["seller"]}>
        <SellerLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<SellerDashboard />} />
  </Route>
);

export default sellerRoutes;
