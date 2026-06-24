import { api } from "../utils/apiClient";

export const categoryAPI = {
  //fetch all categories
  fetchCategory: async ({ pagination, uniqueCategories }) => {
    if (uniqueCategories && uniqueCategories.length > 0) {
      return api.post(
        `category/fetch?page=${pagination.page}&limit=${pagination.limit}`,
        { uniqueCategories },
      );
    } else {
      return api.post(
        `category/fetch?page=${pagination.page}&limit=${pagination.limit}`,
      );
    }
  },
};
