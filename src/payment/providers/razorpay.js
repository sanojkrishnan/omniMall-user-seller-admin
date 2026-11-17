import { api } from "../../utils/apiClient";

const errMsg = (e, fallback) =>
  e.response?.data?.error?.message || e.response?.data?.message || fallback;

let scriptPromise;
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => {
        scriptPromise = null; // allow retry
        resolve(false);
      };
      document.body.appendChild(s);
    });
  }
  return scriptPromise;
}

// Open the popup on the chosen method only (UPI, card, ...)
const ALL = ["upi", "card", "netbanking", "wallet", "emi", "paylater"];
const onlyMethod = (id) =>
  ALL.includes(id)
    ? Object.fromEntries(ALL.map((m) => [m, m === id]))
    : undefined;

/** @returns {Promise<{ok:boolean, orderId?:string, message?:string, cancelled?:boolean}>} */
export default async function razorpayProvider({
  methodId,
  payload,
  prefill = {},
}) {
  let data;
  try {
    // your api wrapper already returns res.data
    data = await api.post("create-order", {
      ...payload,
      paymentMethod: methodId,
    });
  } catch (e) {
    return { ok: false, message: errMsg(e, "Could not create order") };
  }

  if (!(await loadRazorpay()))
    return { ok: false, message: "Could not load payment gateway" };

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // CRA: process.env.REACT_APP_RAZORPAY_KEY_ID
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: "OmniMall",
      description: "Order payment",
      prefill,
      method: onlyMethod(methodId),
      theme: { color: "#000000" },
      handler: async (response) => {
        try {
          await api.post("verify-payment", response);
          resolve({ ok: true, orderId: data.orderId });
        } catch (e) {
          resolve({
            ok: false,
            message: errMsg(e, "Payment verification failed"),
          });
        }
      },
      modal: {
        ondismiss: () =>
          resolve({ ok: false, cancelled: true, message: "Payment cancelled" }),
      },
    });
    rzp.on("payment.failed", (r) =>
      resolve({ ok: false, message: r.error?.description || "Payment failed" }),
    );
    rzp.open();
  });
}
