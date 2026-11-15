import { api } from "../utils/apiClient";

export const addressAPI = {
  fetchAddress: async () => {
    return api.get("address/fetch-address");
  },
  addAddress: async (values) => {
    return api.post("address/add-address", values);
  },
  setDefaultAddress: async (addressId) => {
    return api.patch("address/set-default", addressId);
  },
  deleteAddress: async ({ addressId }) => {
    return api.delete(`address/delete-address/${addressId}`);
  },
  updateAddress: async (addressId, values) => {
    return api.patch(`address/update-address/${addressId}`, values);
  },
};
