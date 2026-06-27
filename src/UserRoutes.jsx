import { Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProfileComplete from "./pages/user/ProfileComplete";
import UserLayout from "./components/ui/UserLayout";
import Shop from "./pages/user/Shop";
import Home from "./pages/public/Home";

const userRoutes = (
  <>
    <Route
      path="/profile_complete"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <ProfileComplete />
        </ProtectedRoute>
      }
    />

    <Route
      path="/user"
      element={
        <ProtectedRoute allowedRoles={["user"]}>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path="" element={<Home />} />
      <Route path="shop" element={<Shop />} />
    </Route>
  </>
);

export default userRoutes;
