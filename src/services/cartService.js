import { api } from "../utils/apiClient";

export const cartAPI = {
  //fetch all categories
  addCart: async (data) => {
    return api.post("cart/add-cart", data);
  },
};
