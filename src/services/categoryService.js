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
  //fetch single category
  fetchOneCategory: async (id) => {
    return api.get(`category/fetch-single/${id}`);
  },
  //update category
  updateCategory: async (id, values) => {
    return api.update(`admin/category/update/${id}`, values, {
      authRole: "admin",
    });
  },

  deleteCategory: async (id) => {
    return api.delete(`admin/category/delete/${id}`, {
      authRole: "admin",
    });
  },
  //add category
  addCategory: async (data) => {
    console.log("DATA FROM THE ADD CATEGORY SERVICE :", data);
    return api.upload("admin/category/add", data, {
      authRole: "admin",
    });
  },
};
