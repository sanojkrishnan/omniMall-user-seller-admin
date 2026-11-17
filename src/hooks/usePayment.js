import { useCallback, useRef, useState } from "react";
import { providers } from "../payment/providers";
import { enabledMethods, getMethod } from "../payment/methords";

/**
 * const { pay, methods, isProcessing, status, error, orderId, reset } = usePayment();
 *
 * const result = await pay({
 *   methodId: "upi",                         // any id from payment/methods.js
 *   payload: { productId, qty, addressId, deliveryId, couponCode, note },
 *   prefill: { name, email, contact },       // optional
 * });
 * result -> { ok, orderId?, message?, cancelled? }
 */
export default function usePayment() {
  const [status, setStatus] = useState("idle"); // idle | processing | success | failed | cancelled
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const busy = useRef(false); // blocks double clicks

  const pay = useCallback(async ({ methodId, payload, prefill }) => {
    if (busy.current)
      return { ok: false, message: "Payment already in progress" };

    const method = getMethod(methodId);
    const provider = method?.enabled && providers[method.provider];
    if (!provider) {
      const message = "This payment method is not available";
      setStatus("failed");
      setError(message);
      return { ok: false, message };
    }

    busy.current = true;
    setStatus("processing");
    setError("");

    let result;
    try {
      result = await provider({ methodId, payload, prefill });
    } catch (e) {
      result = { ok: false, message: e?.message || "Something went wrong" };
    }

    busy.current = false;
    if (result.ok) {
      setStatus("success");
      setOrderId(result.orderId ?? null);
    } else {
      setStatus(result.cancelled ? "cancelled" : "failed");
      setError(result.message || "Payment failed");
    }
    return result;
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError("");
    setOrderId(null);
  }, []);

  return {
    pay,
    reset,
    status,
    error,
    orderId,
    isProcessing: status === "processing",
    methods: enabledMethods(),
  };
}
