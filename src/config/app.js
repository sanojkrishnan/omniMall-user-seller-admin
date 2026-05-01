export const API_CONFIG = {
  baseURL: import.meta.env.SERVER_URL,
  socketURL: import.meta.env.SOCKET_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const AUTH_CONFIG = {
  tokenKey: "authToken",
  adminTokenKey: "adminToken",
  userKey: "user",
  adminKey: "admin",
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};
