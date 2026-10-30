import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import ProfileComplete from "../pages/user/ProfileComplete";
import UserLayout from "../layouts/UserLayout";
import Shop from "../pages/user/Shop";
import Home from "../pages/public/Home";
import SingleProduct from "../pages/user/SingleProduct";
import Cart from "../pages/user/Cart";
import CouponsInUser from "../components/CouponsInUser";
import UserProfile from "../pages/user/UserProfile";
import PersonalInfo from "../components/PersonalInfo";

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
      <Route path="cart" element={<Cart />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path={`shop/product/:id`} element={<SingleProduct />} />
      <Route path={`profile/coupons`} element={<CouponsInUser />} />
      <Route path={`profile/personal-info`} element={<PersonalInfo />} />
    </Route>
  </>
);

export default userRoutes;
