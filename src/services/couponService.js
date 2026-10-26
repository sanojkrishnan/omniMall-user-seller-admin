import { api } from "../utils/apiClient";

export const couponAPI = {
  fetchCoupons: async ({
    page = 1,
    limit = 15,
    search = "",
    sort = "newest",
    isFeatured = false,
  }) => {
    return api.get("coupon/fetch", {
      params: { page, limit, search, sort, isFeatured },
    });
  },
  updateCoupon: async (id, data) => {
    return api.patch(`coupon/update/${id}`, data, { authRole: "admin" });
  },
  fetchCouponById: async (id) => {
    return api.get(`coupon/singleFetch/${id}`);
  },
  //delete product
  deleteCoupon: async (id) => {
    return api.delete(`admin/coupon/delete/${id}`, {
      authRole: "admin",
    });
  },
  changeCouponStatus: async (id, status) => {
    return api.patch(
      `admin/coupon/updateStatus/${id}`,
      { status },
      {
        authRole: "admin",
      },
    );
  },
  createCoupon: async (data) => {
    return api.post("admin/coupon/add", data, { authRole: "admin" });
  },
};
