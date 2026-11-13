import { api } from "../utils/apiClient";

export const addressAPI = {
  fetchAddress: async () => {
    return api.get("address/fetch-address");
  },
  addAddress: async (values) => {
    return api.post("address/add-address", values);
  },
};
