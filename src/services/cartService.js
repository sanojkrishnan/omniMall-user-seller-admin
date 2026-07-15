import { api } from "../utils/apiClient";

export const cartAPI = {
  addCart: async (data) => {
    return api.post("cart/add", data);
  },
  fetchCart: async (id) => {
    return api.get("cart/fetch", id);
  },
};
