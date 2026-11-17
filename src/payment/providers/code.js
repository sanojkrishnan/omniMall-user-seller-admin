import { api } from "../../utils/apiClient";

export default async function codProvider({ payload }) {
  try {
    const data = await api.post("create-order", {
      ...payload,
      paymentMethod: "cod",
    });
    return { ok: true, orderId: data.orderId };
  } catch (e) {
    return {
      ok: false,
      message:
        e.response?.data?.error?.message ||
        e.response?.data?.message ||
        "Could not place order",
    };
  }
}
