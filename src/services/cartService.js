import { api } from "../utils/apiClient";

export const cartAPI = {
  addCart: async (data) => {
    return api.post("cart/add", data);
  },
  fetchCart: async () => {
    console.log("FETCH CART FROM THE BACKEND , ROUTE FROM FRONTEND");
    return api.get("cart/fetch");
  },
  updateQuantity: async (data) => {
    return api.patch("cart/updateQuantity", data);
  },
  removeCart: async (productId) => {
    return api.delete(`cart/remove/${productId}`);
  },
};
