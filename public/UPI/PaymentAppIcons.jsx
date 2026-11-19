import googlePay from "./google-pay-icon.svg";
import phonePay from "./phonepe.svg";

export default function PaymentAppIcons({ name }) {
  return (
    <div className="w-6 h-6">
      {name === "gpay" && (
        <img
          src={googlePay}
          alt="Google Pay"
          className="w-full h-full object-contain"
        />
      )}

      {name === "phonepe" && (
        <img
          src={phonePay}
          alt="PhonePe"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
