import { Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProfileComplete from "./pages/user/ProfileComplete";

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
  </>
);

export default userRoutes;
