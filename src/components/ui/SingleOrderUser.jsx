import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CreditCard, MapPin } from "lucide-react";
import BackButtonUser from "../../components/ui/BackButtonUser";
import { FormCard } from "../../components/ui/FormCard";
import OrderCard from "../../components/ui/OrderCard";
import { useCurrency } from "../../hooks/useCurrency";
import CartLoading from "./CartLoading";
import ErrorFallback from "./ErrorFallback";
import {
  clearOrderState,
  fetchSingleOrder,
} from "../../redux/slice/orderSlice";

const PAYMENT_LABEL = {
  card: "Card",
  upi: "UPI",
  wallet: "Wallet",
  netBanking: "Net banking",
  cod: "Cash on delivery",
};

function Row({ label, value, green }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-neutral-600">{label}</dt>
      <dd className={green ? "font-medium text-green-700" : "font-medium"}>
        {value}
      </dd>
    </div>
  );
}

export default function SingleOrderUser() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const inr = useCurrency();

  const {
    orders: order,
    isOrderLoading,
    isOrderFetched,
    orderError,
    orderErrorStatus,
    orderMessage,
  } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchSingleOrder(orderId));
    return () => {
      dispatch(clearOrderState());
    };
  }, [dispatch, orderId]);

  // loading: request in flight, or not finished yet
  if (isOrderLoading || (!isOrderFetched && !orderError)) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="flex h-[80vh] w-full items-center justify-center">
          <CartLoading />
        </div>
      </div>
    );
  }

  // error, or fetched but no order came back
  if (orderError || !order) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <ErrorFallback
          loading={false}
          error={orderError || "Order not found"}
          message={orderMessage}
          statusCode={orderErrorStatus}
          fallbackErrorMessage="Failed to load order"
          onRetry={() => dispatch(fetchSingleOrder(orderId))}
        />
      </div>
    );
  }

  const { shippingAddress: addr } = order;
  const saved = (order.productDiscount ?? 0) + (order.couponDiscount ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 mt-16 sm:p-6">
      <BackButtonUser variant="secondary" />
      <OrderCard
        order={order}
      />

      <div className="grid gap-4 md:grid-cols-2 items-center justify-center">
        <FormCard>
          <h2 className="mb-3 font-bold">Price details</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Price" value={inr(order.mrpTotal)} />
            <Row
              label="Product discount"
              value={`− ${inr(order.productDiscount)}`}
              green
            />
            {order.couponDiscount > 0 && (
              <Row
                label={`Coupon (${order.couponCode})`}
                value={`− ${inr(order.couponDiscount)}`}
                green
              />
            )}
            <Row
              label="Delivery fee"
              value={order.deliveryFee === 0 ? "FREE" : inr(order.deliveryFee)}
              green={order.deliveryFee === 0}
            />
            {order.codFee > 0 && (
              <Row label="COD fee" value={inr(order.codFee)} />
            )}
            <div className="flex items-center justify-between border-t border-black pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{inr(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-neutral-500">
            Includes GST of {inr(order.gstIncluded)}
          </p>
          {saved > 0 && (
            <p className="mt-3 rounded-lg bg-black/[0.04] px-3 py-2 text-xs font-semibold text-yellow-700">
              You saved {inr(saved)} on this order
            </p>
          )}
        </FormCard>

        <div className="space-y-4">
          {addr && (
            <FormCard>
              <h2 className="mb-2 flex items-center gap-2 font-bold">
                <MapPin className="h-4 w-4" /> Delivery address
              </h2>
              <p className="text-sm font-semibold">
                {addr.name}
                {addr.label && (
                  <span className="ml-2 text-xs font-normal text-neutral-500">
                    ({addr.label})
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                {[addr.line1, addr.line2, addr.city, addr.state]
                  .filter(Boolean)
                  .join(", ")}{" "}
                – {addr.pincode}
              </p>
              {addr.phone && (
                <p className="mt-1 text-xs text-neutral-600">{addr.phone}</p>
              )}
            </FormCard>
          )}

          <FormCard>
            <h2 className="mb-2 flex items-center gap-2 font-bold">
              <CreditCard className="h-4 w-4" /> Payment
            </h2>
            <p className="text-sm">
              {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
            </p>
            <p className="mt-0.5 text-xs capitalize text-neutral-500">
              Status: {order.paymentStatus}
            </p>
          </FormCard>

          {order.notes && (
            <FormCard>
              <h2 className="mb-2 font-bold">Order notes</h2>
              <p className="break-words text-sm text-neutral-600">
                {order.notes}
              </p>
            </FormCard>
          )}
        </div>
      </div>
    </div>
  );
}
