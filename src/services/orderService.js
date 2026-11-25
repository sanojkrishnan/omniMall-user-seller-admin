import { api } from "../utils/apiClient";

export const orderAPI = {
  addOrder: async (values) => {
    return api.post("orders/create-order", values);
  },
  fetchSingleOrder: async (orderId) => {
    return api.post("orders/fetch-single-order", orderId);
  },
};
