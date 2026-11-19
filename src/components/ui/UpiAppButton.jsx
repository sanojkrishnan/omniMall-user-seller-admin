import { useState } from "react";
import { MERCHANT_ADDRESS } from "../../config/app";
import PaymentAppIcons from "../../../public/UPI/PaymentAppIcons";

export const buildUpiLink = (scheme, { amount, note, txnRef }) => {
  const params = new URLSearchParams({
    pa: MERCHANT_ADDRESS.UPI_ID,
    pn: "OmniMall",
    cu: "INR",
    tn: note || "OmniMall order",
    ...(amount ? { am: Number(amount).toFixed(2) } : {}),
    ...(txnRef ? { tr: txnRef } : {}),
  });
  return `${scheme}?${params.toString()}`;
};

export default function UpiAppButton({ app, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onOpen(app)}
      className="flex flex-col items-center gap-2 rounded-2xl border border-black/15 bg-white sm:p-4 p-2 transition hover:border-black"
    >
      {imgFailed ? (
        <span className="grid h-12 w-12 place-items-center rounded-full border border-black text-sm font-bold">
          {app.name[0]}
        </span>
      ) : (
        <PaymentAppIcons name={app.name} />
      )}
      <span className="text-xs font-semibold">{app.name}</span>
    </button>
  );
}
