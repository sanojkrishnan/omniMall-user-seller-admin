import { api } from "../utils/apiClient";

export const orderAPI = {
  addOrder: async (values) => {
    console.log("ORDERED:", values)
    return api.post("orders/create-order", values);
  },
};
