import { api } from "../utils/apiClient";

export const addressAPI = {
  fetchAddress: async () => {
    return api.get("address/fetch-address");
  },
};
