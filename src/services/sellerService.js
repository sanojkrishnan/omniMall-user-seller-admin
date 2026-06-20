import { api } from "../utils/apiClient";

export const sellerAPI = {
  fetchSeller: async (data) => {
    return api.get("seller/fetch", data);
  },
};
