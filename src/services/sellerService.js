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
  fetchOneSeller: async () => {
    return api.get(`seller/fetch-single`);
  },
  //update seller
  updateSeller: async (values) => {
    return api.update("seller/update-seller", values, { authRole: "seller" });
  },
};
