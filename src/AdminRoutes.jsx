import { Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/ui/AdminLayout";
import Products from "./pages/admin/Products";
import Users from "./pages/admin/Users";
import Categories from "./pages/admin/Categories";

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
    </Route>
  </>
);

export default adminRoutes;
