import { api } from "../utils/apiClient";

export const orderAPI = {
  addOrder: async (values) => {
    return api.post("orders/create-order", values);
  },
  fetchSingleOrder: async (orderId) => {
    return api.get(`orders/fetch-single-order/${orderId}`);
  },
  downloadOrderInvoice: async (orderId) => {
    return api.get(`orders/invoice/${orderId}`);
  },
  cancelOrder: async (orderId) => {
    return api.patch(`orders/cancel-order/${orderId}`);
  },
};
