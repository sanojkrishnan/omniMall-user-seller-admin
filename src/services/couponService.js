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

  fetchCouponById: async (id) => {
    return api.get(`coupon/singleFetch/${id}`);
  },
};
