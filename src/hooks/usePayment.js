import { useCallback, useState } from "react";
import { RAZORPAY_CONFIG } from "../config/app";
import { paymentAPI } from "../services/paymentService";

const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CONFIG.razorpayScript;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay"));

    document.body.appendChild(script);
  });
};

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = useCallback(async (payload = {}) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Load Razorpay checkout
      await loadRazorpay();

      // 2. Create payment order on backend
      const { data } = paymentAPI.createPaymentOrder(payload);

      const { keyId, orderId, amount, currency } = data.data;

      // 3. Open Razorpay checkout
      return await new Promise((resolve, reject) => {
        const options = {
          key: keyId,
          amount,
          currency,
          name: "OmniMall",
          description: "Order Payment",
          order_id: orderId,

          handler: async (response) => {
            try {
              // 4. Verify payment on backend
              const verification = paymentAPI.paymentVerify(response);

              resolve(verification.data);
            } catch (err) {
              setError(
                err.response?.data?.message || "Payment verification failed",
              );

              reject(err);
            }
          },

          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                cancelled: true,
                message: "Payment cancelled",
              });
            },
          },

          theme: {
            color: "#2563eb",
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", (response) => {
          const message = response.error?.description || "Payment failed";

          setError(message);

          resolve({
            success: false,
            cancelled: false,
            message,
          });
        });

        razorpay.open();
      });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    initiatePayment,
    loading,
    error,
  };
};

export default usePayment;
