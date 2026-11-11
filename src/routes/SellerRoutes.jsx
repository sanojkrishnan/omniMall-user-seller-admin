import { Route } from "react-router-dom";
import SellerDashboard from "../pages/seller/SellerDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import SellerLayout from "../layouts/SellerLayout";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerProfile from "../pages/seller/SellerProfile";

const sellerRoutes = (
  <Route
    path="/seller"
    element={
      <ProtectedRoute allowedRoles={["seller"]}>
        <SellerLayout />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<SellerDashboard />} />
    <Route path="products" element={<SellerProducts />} />
    <Route path="profile" element={<SellerProfile />} />
    {/* <Route path="products/add" element={<AddProduct />} />
    <Route path="orders" element={<SellerOrders />} />
    <Route path="reviews" element={<SellerReviews />} />
      */}
  </Route>
);

export default sellerRoutes;
