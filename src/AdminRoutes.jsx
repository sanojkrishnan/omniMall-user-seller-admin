import { Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/ui/AdminLayout";
import Products from "./pages/admin/Products";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";
import Coupon from "./pages/admin/Coupon";
import SingleCouponDetail from "./components/SingleCouponDetail";

const adminRoutes = (
  <>
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="users" element={<Users />} />
      <Route path="categories" element={<Categories />} />
      <Route path="coupon" element={<Coupon />} />
      <Route path={`coupon/:couponId`} element={<SingleCouponDetail />} />
    </Route>
  </>
);

export default adminRoutes;
