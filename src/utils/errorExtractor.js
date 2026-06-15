//  helper to extract error message from axios error
export const extractError = (err, fallback) =>
  err.response?.data?.error?.message ||
  err.response?.data?.message ||
  err.message ||
  fallback;
