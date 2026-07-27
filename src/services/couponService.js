import { api } from "../utils/apiClient";

export const couponAPI = {
  fetchCoupons: async ({
    page = 1,
    limit = 15,
    search = "",
    sort = "newest",
  }) => {
    return api.get("coupon/fetch", {
      params: { page, limit, search, sort },
    });
  },
  updateCoupon: async (id, data) => {
    console.log("COUPON EDIT DATA :", data);
    return api.patch(`coupon/update/${id}`, { data });
  },
  fetchCouponById: async (id) => {
    return api.get(`coupon/singleFetch/${id}`);
  },
};
