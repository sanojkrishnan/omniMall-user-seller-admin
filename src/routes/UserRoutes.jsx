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
import AddressBook from "../components/AddressBook";
import OrdersReturns from "../components/OrderAndReturn";
import PaymentMethods from "../components/PaymentMethords";
import LoginSecurity from "../components/LoginSecurity";
import LikesReviews from "../components/LikesReviews";
import ShoppingPreferences from "../components/ShoppingPreferences";
import SellerRegister from "../components/SellerRegister";

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
      <Route path={`profile/addresses`} element={<AddressBook />} />
      <Route path={`profile/orders`} element={<OrdersReturns />} />
      <Route path={`profile/payments`} element={<PaymentMethods />} />
      <Route path={`profile/security`} element={<LoginSecurity />} />
      <Route path={`profile/preferences`} element={<ShoppingPreferences />} />
      <Route path={`profile/likes-reviews`} element={<LikesReviews />} />
      <Route path={`profile/seller-register`} element={<SellerRegister />} />
    </Route>
  </>
);

export default userRoutes;
