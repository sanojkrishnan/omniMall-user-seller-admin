import { Package, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "../ui/Button";
import { FormCard } from "../ui/FormCard";
import CouponBox from "./CouponBox";
import Row from "./Row";
import { useCurrency } from "../../hooks/useCurrency";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearOrderState } from "../../redux/slice/orderSlice";

export default function OrderSummary({
  totals,
  coupon,
  couponProps,
  delivery,
  paymentId,
  selectedAddress,
  canPlace,
  onPlace,
  validationErrors,
  orderId,
  orderMessage,
}) {
  const {
    itemCount,
    mrpTotal,
    productDiscount,
    couponDiscount,
    deliveryFee,
    codFee,
    total,
    gstIncluded,
  } = totals;

  const inr = useCurrency();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!orderId) return;
    if (orderMessage) {
      toast.success(orderMessage);
    }
    dispatch(clearOrderState());
    navigate(`/user/shop/order/${orderId}`);
  }, [orderId, orderMessage, dispatch, navigate]);

  return (
    <FormCard className="space-y-3 lg:sticky lg:top-24">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Package className="h-5 w-5" /> Order summary
      </h2>
      <div>
        <CouponBox coupon={coupon} {...couponProps} />
        <div className="flex w-full items-end">
          <button
            type="button"
            onClick={() => navigate(`/user/profile/coupons`)}
            className="ml-auto mt-4 text-xs font-semibold underline underline-offset-4 hover:opacity-60"
          >
            Check for coupons
          </button>
        </div>
      </div>
      <dl className="space-y-2 border-t border-black/10 pt-4 text-sm">
        <Row
          label={`Price (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
          value={inr(mrpTotal)}
        />
        <Row
          label="Product discount"
          value={`− ${inr(productDiscount)}`}
          green
        />
        {couponDiscount > 0 && (
          <Row
            label={`Coupon (${coupon.code})`}
            value={`− ${inr(couponDiscount)}`}
            green
          />
        )}
        <Row
          label="Delivery fee"
          value={deliveryFee === 0 ? "FREE" : inr(deliveryFee)}
          green={deliveryFee === 0}
        />
        {codFee > 0 && <Row label="Cash on delivery fee" value={inr(codFee)} />}
        <div className="flex items-center justify-between border-t border-black pt-3 text-base font-bold">
          <dt>Total amount</dt>
          <dd>{inr(total)}</dd>
        </div>
        <p className="text-xs text-neutral-500">
          Includes GST of {inr(gstIncluded)}
        </p>
        {productDiscount + couponDiscount > 0 && (
          <p className="rounded-lg bg-black/[0.04] text-yellow-700 px-3 py-2 text-xs font-semibold">
            You save {inr(productDiscount + couponDiscount)} on this order
          </p>
        )}
      </dl>
      {selectedAddress && (
        <div className="border-t border-black/10 pt-4 text-xs text-neutral-600">
          <p className="font-semibold text-black">Delivering to</p>
          <p className="mt-1 leading-relaxed">
            {selectedAddress.name}, {selectedAddress.line1},{" "}
            {selectedAddress.city} {selectedAddress.pincode}
          </p>
          <p className="mt-1">
            {delivery.label} · {delivery.eta}
          </p>
        </div>
      )}
      {/* //alert */}
      {validationErrors.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-yellow-500 bg-yellow-500/10 p-3 text-sm"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-yellow-500" />
          <ul className="min-w-0 space-y-1 break-words">
            {validationErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
      {/* //confirm button */}
      <Button className="w-full" disabled={!canPlace} onClick={onPlace}>
        {paymentId === "cod" ? "Place order" : `Pay ${inr(total)}`}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
        <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout · Easy 7-day
        returns
      </p>
    </FormCard>
  );
}
