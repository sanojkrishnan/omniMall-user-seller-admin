import {
  Banknote,
  CreditCard,
  Landmark,
  Smartphone,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";

export const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard delivery",
    eta: "4–6 days",
    fee: 49,
    icon: Truck,
  },
  {
    id: "express",
    label: "Express delivery",
    eta: "1–2 days",
    fee: 129,
    icon: Zap,
  },
];

export const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FLAT200: { type: "flat", value: 200, label: "₹200 off" },
};

export const PAYMENTS = [
  {
    id: "upi",
    label: "UPI",
    hint: "Google Pay, PhonePe, Paytm",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Credit / Debit card",
    hint: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    label: "Net banking",
    hint: "All major banks",
    icon: Landmark,
  },
  { id: "wallet", label: "Wallet", hint: "Supported wallets", icon: Wallet },
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when it arrives (+₹30 fee)",
    icon: Banknote,
  },
];

export const FREE_DELIVERY_ABOVE = 999;
export const COD_FEE = 30;
export const GST_RATE = 0.18;

export const inputCls =
  "w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-black";
