import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  MapPin,
  Package,
  Repeat,
  Truck,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { FormCard } from "../../components/ui/FormCard";
import ProductTracker from "../../components/ui/ProductTracker";
import { useCurrency } from "../../hooks/useCurrency";
import CartLoading from "./CartLoading";

const ORDER_STEPS = [
  { label: "Placed", icon: ClipboardCheck },
  { label: "Packed", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

const STAGE = { pending: 0, confirmed: 1, shipped: 2, delivered: 3 };

const STATUS_LABEL = {
  pending: "Processing",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_LABEL = {
  card: "Card",
  upi: "UPI",
  wallet: "Wallet",
  netBanking: "Net banking",
  cod: "Cash on delivery",
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const addDays = (d, n) => {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
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
  const navigate = useNavigate();
  const inr = useCurrency();

  const {
    singleOrder: order,
    isSingleLoading,
    singleOrderError,
  } = useSelector((state) => state.order);

  useEffect(() => {
    // dispatch(fetchOrder(orderId));
    return () => {
      //   dispatch(clearSingleOrder());
    };
  }, [dispatch, orderId]);

  const back = (
    <button
      type="button"
      onClick={() => navigate("/user/profile/orders")}
      className="mb-4 inline-flex items-center gap-2 text-sm font-semibold hover:opacity-60"
    >
      <ArrowLeft className="h-4 w-4" /> Back to orders
    </button>
  );

  if (isSingleLoading || (!order && !singleOrderError)) {
    return (
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        {back}
        <div className="h-[80vh] w-full flex items-center justify-center">
          <CartLoading />
        </div>
      </div>
    );
  }

  if (singleOrderError || !order) {
    return (
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        {back}
        <FormCard className="py-16 text-center">
          <Package className="mx-auto h-8 w-8 text-neutral-400" />
          <p className="mt-3 font-semibold">Order not found</p>
          <p className="mt-1 text-sm text-neutral-500">{singleOrderError}</p>
        </FormCard>
      </div>
    );
  }

  const { status, shippingAddress: addr } = order;
  const active = ["pending", "confirmed", "shipped"].includes(status);
  const canCancel = status === "pending" || status === "confirmed";
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const saved = order.productDiscount + order.couponDiscount;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 sm:p-6">
      {back}

      {/* header */}
      <FormCard className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="break-all text-lg font-bold">
            Order #{order.orderId}
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            Placed on {fmtDate(order.createdAt)} · {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-0.5 text-[11px] font-semibold ${
            status === "delivered"
              ? "border border-black bg-black text-white"
              : status === "cancelled"
                ? "border border-black/30 text-neutral-500"
                : "border border-black"
          }`}
        >
          {STATUS_LABEL[status]}
        </span>
      </FormCard>

      {/* progress */}
      <FormCard>
        {active && (
          <>
            <ProductTracker steps={ORDER_STEPS} stage={STAGE[status]} />
            <p className="mt-4 text-center text-xs font-medium text-neutral-600">
              Estimated delivery by {fmtDate(addDays(order.createdAt, 5))}
            </p>
          </>
        )}
        {status === "delivered" && (
          <p className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4" /> Delivered on{" "}
            {fmtDate(order.updatedAt)}
          </p>
        )}
        {status === "cancelled" && (
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <X className="h-4 w-4" /> Cancelled on {fmtDate(order.updatedAt)}.
          </p>
        )}
      </FormCard>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* items */}
        <FormCard className="lg:col-span-2">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <Package className="h-4 w-4" /> Items
          </h2>
          <ul className="divide-y divide-black/10">
            {order.items.map((item) => (
              <li
                key={`${item.productId}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
                className="flex items-center gap-4 py-4"
              >
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/15 bg-neutral-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-neutral-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {inr(item.price)} × {item.quantity}
                    {item.variant?.size && ` · ${item.variant.size}`}
                    {item.variant?.color && ` · ${item.variant.color}`}
                  </p>
                  {item.mrp > item.price && (
                    <p className="text-xs text-neutral-400 line-through">
                      {inr(item.mrp)}
                    </p>
                  )}
                </div>
                <p className="text-sm font-semibold">
                  {inr(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </FormCard>

        <div className="space-y-4">
          {/* price details */}
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
                value={
                  order.deliveryFee === 0 ? "FREE" : inr(order.deliveryFee)
                }
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

          {/* delivery address */}
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

          {/* payment */}
          <FormCard>
            <h2 className="mb-2 flex items-center gap-2 font-bold">
              <CreditCard className="h-4 w-4" /> Payment
            </h2>
            <p className="text-sm">{PAYMENT_LABEL[order.paymentMethod]}</p>
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

      {/* actions */}
      <div className="flex flex-wrap gap-2">
        {canCancel && (
          <Button className="w-fit shadow-none">
            <X className="h-3 w-3" /> Cancel order
          </Button>
        )}
        {(status === "delivered" || status === "cancelled") && (
          <Button className="w-fit shadow-none" variant="secondary">
            <Repeat className="h-3 w-3" /> Buy again
          </Button>
        )}
        {status !== "cancelled" && (
          <Button className="w-fit shadow-none" variant="secondary">
            <Download className="h-3 w-3" /> Invoice
          </Button>
        )}
      </div>
    </div>
  );
}
