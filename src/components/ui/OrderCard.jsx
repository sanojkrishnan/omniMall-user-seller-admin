import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  Package,
  Repeat,
  RotateCcw,
  Truck,
  X,
} from "lucide-react";
import { Button } from "./Button";
import ProductTracker from "./ProductTracker";
import { useCurrency } from "../../hooks/useCurrency";
import { useNavigate } from "react-router-dom";

const ORDER_STEPS = [
  { label: "Placed", icon: ClipboardCheck },
  { label: "Packed", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

// backend status -> tracker stage (0-based, same order as ORDER_STEPS)
const STAGE = { pending: 0, confirmed: 1, shipped: 2, delivered: 3 };

const STATUS_LABEL = {
  pending: "Processing",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLES = {
  pending: "border border-black",
  confirmed: "border border-black",
  shipped: "border border-black",
  delivered: "bg-black text-white border border-black",
  cancelled: "border border-black/30 text-neutral-500",
};

const RETURN_WINDOW_DAYS = 7;
const DELIVERY_DAYS = 5; // estimate, until the backend stores a real ETA

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

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export default function OrderCard({ order }) {
  const inr = useCurrency();
  const navigate = useNavigate();

  const { status } = order;
  const active = ["pending", "confirmed", "shipped"].includes(status);
  const canCancel = status === "pending" || status === "confirmed";

  // the backend only has createdAt/updatedAt, so these are derived
  const eta = fmtDate(addDays(order.createdAt, DELIVERY_DAYS));
  const returnBy = addDays(order.updatedAt, RETURN_WINDOW_DAYS);
  const canReturn = status === "delivered" && new Date() <= returnBy;

  const handleCancel = (o) => {
    // dispatch(cancelOrder(o.orderId));
  };
  const handleReturn = (o) => {
    // dispatch(returnOrder(o.orderId));
  };
  const handleBuyAgain = (o) => {
    // dispatch(buyAgain(o.orderId));
  };
  const handleInvoice = (o) => {
    // dispatch(downloadInvoice(o.orderId));
  };

  return (
    <article className="rounded-2xl border border-black/15 bg-white transition hover:border-black/60">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 p-5 sm:px-6">
        <div className="min-w-0">
          <p className="break-all font-bold">Order #{order.orderId}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Placed {fmtDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <p className="text-sm font-bold">{inr(order.total)}</p>
        </div>
      </div>

      {/* items */}
      <ul className="divide-y divide-black/10 px-5 sm:px-6">
        {order.items.map((item) => (
          <li
            key={`${item.productId}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
            className="flex items-center gap-4 py-4"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/15 bg-neutral-50">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package
                  className="h-6 w-6 text-neutral-400"
                  strokeWidth={1.5}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.name}</p>
              <p className="mt-0.5 text-xs text-neutral-500">
                Qty {item.quantity}
                {item.variant?.size && ` · ${item.variant.size}`}
                {item.variant?.color && ` · ${item.variant.color}`}
              </p>
              <p className="text-sm font-medium">
                {inr(item.price * item.quantity)}
              </p>
            </div>
            <Button
              onClick={() => navigate(`/user/shop/product/${item.productId}`)}
              className={"w-fit"}
            >
              Check product
            </Button>
          </li>
        ))}
      </ul>

      {/* progress / status line */}
      <div className="border-t border-black/10 px-5 py-5 sm:px-6">
        {active && (
          <>
            <ProductTracker steps={ORDER_STEPS} stage={STAGE[status]} />
            <p className="mt-4 text-center text-xs font-medium text-neutral-600">
              Estimated delivery by {eta}
            </p>
          </>
        )}
        {status === "delivered" && (
          <p className="flex flex-wrap items-center gap-x-2 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Delivered on {fmtDate(order.updatedAt)}
            </span>
            <span className="text-neutral-500">
              ·{" "}
              {canReturn
                ? `Return by ${fmtDate(returnBy)}`
                : `Return window closed ${fmtDate(returnBy)}`}
            </span>
          </p>
        )}
        {status === "cancelled" && (
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <X className="h-4 w-4 shrink-0" /> Cancelled on{" "}
            {fmtDate(order.updatedAt)}.
            {order.paymentStatus === "refunded" ||
            order.paymentStatus === "paid"
              ? " Any payment is refunded to the original method."
              : ""}
          </p>
        )}
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-black/10 px-5 py-4 sm:px-6">
        {canCancel && (
          <Button className="w-fit shadow-none" onClick={() => handleCancel}>
            <X className="h-3 w-3" /> Cancel order
          </Button>
        )}
        {canReturn && (
          <Button className="w-fit shadow-none" onClick={() => handleReturn}>
            <RotateCcw className="h-3 w-3" /> Return items
          </Button>
        )}
        {(status === "delivered" || status === "cancelled") && (
          <Button
            className="w-fit shadow-none"
            variant="secondary"
            onClick={() => handleBuyAgain}
          >
            <Repeat className="h-3 w-3" /> Buy again
          </Button>
        )}
        {status !== "cancelled" && (
          <Button
            className="w-fit shadow-none"
            variant="secondary"
            onClick={() => handleInvoice}
          >
            <Download className="h-3 w-3" /> Invoice
          </Button>
        )}
      </div>
    </article>
  );
}
