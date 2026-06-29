import { api } from "../utils/apiClient";

export const sellerAPI = {
  //fetch all sellers
  fetchSeller: async ({ pagination, uniqueSellers }) => {
    return api.post(
      `seller/fetch?page=${pagination.page}&limit=${pagination.limit}`,
      { uniqueSellers },
    );
  },
  //fetch single seller
  fetchOneSeller: async (id) => {
    return api.get(`seller/fetch-single/${id}`);
  },
};
