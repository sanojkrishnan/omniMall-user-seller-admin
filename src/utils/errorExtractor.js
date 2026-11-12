// returns { message, statusCode } so the UI can tell a 500 from other errors
export const extractError = (err, fallback = "Something went wrong") => {
  // request never reached the server
  if (!err.response) {
    return {
      message:
        err.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Unable to connect to the server. Please check your connection and try again.",
      statusCode: null,
    };
  }

  return {
    message:
      err.response.data?.error?.message ||
      err.response.data?.message ||
      err.message ||
      fallback,
    statusCode: err.response.status, // 500, 502, 404...
  };
};
