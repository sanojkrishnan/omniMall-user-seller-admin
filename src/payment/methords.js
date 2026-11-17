import {
  Banknote,
  CalendarClock,
  Clock,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
} from "lucide-react";

/**
 * Single source of truth for payment methods.
 *  - id        : sent to the backend as `paymentMethod`
 *  - provider  : key in payment/providers/index.js that handles it
 *  - enabled   : flip to false to hide a method everywhere
 *  - fee       : extra charge shown in the UI (the server must apply it too)
 * To add a method: add one entry here (and a provider if it's a new gateway).
 */
export const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    hint: "Google Pay, PhonePe, Paytm",
    icon: Smartphone,
    provider: "razorpay",
    enabled: true,
    fee: 0,
  },
  {
    id: "card",
    label: "Credit / Debit card",
    hint: "Visa, Mastercard, RuPay, Amex",
    icon: CreditCard,
    provider: "razorpay",
    enabled: true,
    fee: 0,
  },
  {
    id: "netbanking",
    label: "Net banking",
    hint: "All major banks",
    icon: Landmark,
    provider: "razorpay",
    enabled: true,
    fee: 0,
  },
  {
    id: "wallet",
    label: "Wallet",
    hint: "Paytm, PhonePe, Amazon Pay & more",
    icon: Wallet,
    provider: "razorpay",
    enabled: true,
    fee: 0,
  },
  {
    id: "emi",
    label: "EMI",
    hint: "Card & cardless EMI",
    icon: CalendarClock,
    provider: "razorpay",
    enabled: true,
    fee: 0,
  },
  {
    id: "paylater",
    label: "Pay later",
    hint: "Simpl, LazyPay and others",
    icon: Clock,
    provider: "razorpay",
    enabled: true,
    fee: 0,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when it arrives (+₹30 fee)",
    icon: Banknote,
    provider: "cod",
    enabled: true,
    fee: 30,
  },
];

export const getMethod = (id) => PAYMENT_METHODS.find((m) => m.id === id);
export const enabledMethods = () => PAYMENT_METHODS.filter((m) => m.enabled);
export const methodFee = (id) => getMethod(id)?.fee ?? 0;
