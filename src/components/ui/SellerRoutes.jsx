import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import SellerPanel from "../../pages/seller/SellerPanel";

const sellerRoutes = (
  <>
    <Route
      path="/seller"
      element={<ProtectedRoute allowedRoles={["seller"]}></ProtectedRoute>}
    ></Route>
    <Route
      path="panel"
      element={
        <ProtectedRoute>
          <SellerPanel />
        </ProtectedRoute>
      }
    />
  </>
);

export default sellerRoutes;
