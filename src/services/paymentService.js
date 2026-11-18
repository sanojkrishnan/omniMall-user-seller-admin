import { api } from "../utils/apiClient";

export const paymentAPI = {
  createPaymentOrder: async (data) => {
    return api.post("/payment/create-order", data);
  },
  paymentVerify: async (response) => {
    return api.post("/payment/verify", response);
  },
};
