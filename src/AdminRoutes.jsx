import { Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/ui/AdminLayout";

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
    </Route>
  </>
);

export default adminRoutes;
