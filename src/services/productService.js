import { api } from "../utils/apiClient";

export const productAPI = {
  addProduct: async (data) => {
    return api.upload("product/register", data);
  },
  fetchAllProduct: async (data) => {
    return api.get("product/fetch", data);
  },
};
