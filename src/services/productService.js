import { api } from "../utils/apiClient";

export const productAPI = {
  //add product
  addProduct: async (data) => {
    return api.upload("product/register", data);
  },

  //fetch all product
  fetchAllProduct: async ({ queryParams, uniqueProducts }) => {
    const query = new URLSearchParams(queryParams).toString();
    return api.post(`product/fetch?${query}`, { uniqueProducts });
  },

  fetchOneProduct: async (id) => {
    return api.get(`product/fetch-single/${id}`);
  },

  //delete product
  deleteProduct: async (id) => {
    return api.delete(`product/delete/${id}`);
  },
};
