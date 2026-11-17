import razorpay from "./razorpay";
import cod from "./code";

// A provider is: async ({ methodId, payload, prefill }) => { ok, orderId?, message?, cancelled? }
export const providers = { razorpay, cod };

// e.g. registerProvider("stripe", stripeProvider) then set provider: "stripe" in methods.js
export const registerProvider = (name, fn) => {
  providers[name] = fn;
};
