import { api } from "../utils/apiClient";

export const cartAPI = {
  addCart: async (data) => {
    return api.post("cart/add", data);
  },
  fetchCart: async (userId) => {
    return api.get("cart/fetch", { params: { userId } });
  },
  removeCart: async (productId) => {
    return api.delete(`cart/remove/${productId}`);
  },
};
