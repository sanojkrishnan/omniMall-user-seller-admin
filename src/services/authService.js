import { api } from "../utils/apiClient";

export const AuthAPI = {
  //login
  login: async (data) => {
    return api.post("/auth/login", data);
  },
  //register
  register: async (data) => {
    return api.post("/auth/register", data);
  },
};
