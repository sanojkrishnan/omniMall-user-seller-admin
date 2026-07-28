import { productAPI } from "../services/productService";
import { categoryAPI } from "../services/categoryService";
import { sellerAPI } from "../services/sellerService";

export const ASYNC_SELECT_SOURCES = {
  product: {
    fetchPage: async ({ page, search }) => {
      const res = await productAPI.fetchAllProduct({
        queryParams: { page, limit: 10, search },
      });
      return {
        items: res?.data?.data ?? [],
        hasNextPage: res?.data?.pagination?.hasNextPage ?? false,
      };
    },
    fetchById: async (id) => {
      const res = await productAPI.fetchOneProduct(id);
      return res?.data ?? null;
    },
    getId: (item) => item._id,
    // Was item.name — the product schema actually uses productName, so
    // this always resolved to undefined and fell back to showing the id.
    getLabel: (item) => item.productName ?? item.name ?? item._id,
  },

  category: {
    fetchPage: async ({ page, search }) => {
      const res = await categoryAPI.fetchCategory({
        pagination: { page, limit: 10, search },
      });
      return {
        items: res?.data?.data ?? [],
        hasNextPage: res?.data?.pagination?.hasNextPage ?? false,
      };
    },
    fetchById: async (id) => {
      const res = await categoryAPI.fetchOneCategory(id);
      return res?.data ?? null;
    },
    getId: (item) => item._id,
    // Was item.name — categories use categoryName, same bug as product.
    getLabel: (item) => item.categoryName ?? item.name ?? item._id,
  },

  seller: {
    fetchPage: async ({ page, search }) => {
      const res = await sellerAPI.fetchSeller({
        pagination: { page, limit: 10, search },
      });
      return {
        items: res?.data?.data ?? [],
        hasNextPage: res?.data?.pagination?.hasNextPage ?? false,
      };
    },
    fetchById: async (id) => {
      const res = await sellerAPI.fetchOneSeller(id);
      return res?.data?.[0] ?? null;
    },
    getId: (item) => item._id,
    getLabel: (item) => item.storeName ?? item.name ?? item.email,
  },
};