import { api } from "../utils/apiClient";

export const productAPI = {
  //add product
  addProduct: async (data) => {
    return api.upload("product/register", data);
  },
  //fetch all product
  fetchAllProduct: async (data) => {
    return api.get("product/fetch", { params: data });
  },
  //delete product
  deleteProduct: async (id) => {
    return api.delete(`product/delete/${id}`);
  },
};
