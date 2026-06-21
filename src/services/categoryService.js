import { api } from "../utils/apiClient";

export const categoryAPI = {
  //fetch all categories
  fetchCategory: async ({ pagination, uniqueCategories }) => {
    return api.post(
      `category/fetch?page=${pagination.page}&limit=${pagination.limit}`,
      { uniqueCategories },
    );
  },
};
