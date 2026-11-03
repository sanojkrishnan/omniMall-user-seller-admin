import { useState } from "react";
import * as Yup from "yup";
import {
  Package,
  Truck,
  ClipboardCheck,
  CheckCircle2,
  RotateCcw,
  Download,
  Repeat,
  X,
  Banknote,
  CalendarCheck,
  PackageCheck,
} from "lucide-react";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import { CreatePanel } from "./ui/CreatePanel";
import ConfirmProvider from "./ui/ConfirmProvider";

/* ---------- static data ---------- */
const initialOrders = [
  {
    id: "OM-10482",
    placed: "28 Oct 2026",
    status: "Shipped",
    stage: 3,
    eta: "Arriving Wed, 4 Nov",
    items: [
      { id: "i1", name: "Cotton Kurta – Navy (M)", qty: 1, price: 1299 },
      { id: "i2", name: "Leather Wallet – Tan", qty: 1, price: 2199 },
    ],
  },
  {
    id: "OM-10455",
    placed: "30 Oct 2026",
    status: "Processing",
    stage: 1,
    eta: "Expected by Fri, 6 Nov",
    items: [
      { id: "i3", name: "Stainless Steel Bottle 1L", qty: 2, price: 450 },
    ],
  },
  {
    id: "OM-10391",
    placed: "22 Oct 2026",
    status: "Delivered",
    delivered: "27 Oct 2026",
    canReturn: true,
    returnBy: "3 Nov 2026",
    items: [
      { id: "i4", name: "Wireless Earbuds – Black", qty: 1, price: 5999 },
    ],
  },
  {
    id: "OM-10310",
    placed: "14 Oct 2026",
    status: "Delivered",
    delivered: "20 Oct 2026",
    canReturn: false,
    returnBy: "27 Oct 2026",
    items: [
      {
        id: "i5",
        name: "Running Shoes – White (UK 9)",
        qty: 1,
        price: 3799,
        returned: true,
      },
      { id: "i6", name: "Sports Socks Pack of 3", qty: 1, price: 399 },
    ],
  },
  {
    id: "OM-10188",
    placed: "5 Sep 2026",
    status: "Delivered",
    delivered: "9 Sep 2026",
    canReturn: false,
    returnBy: "16 Sep 2026",
    items: [
      {
        id: "i7",
        name: "Denim Jacket – Indigo (L)",
        qty: 1,
        price: 2499,
        returned: true,
      },
    ],
  },
  {
    id: "OM-10102",
    placed: "14 Aug 2026",
    status: "Cancelled",
    cancelledOn: "15 Aug 2026",
    items: [{ id: "i8", name: "Desk Lamp – Matte Black", qty: 1, price: 1499 }],
  },
];

const initialReturns = [
  {
    id: "RT-2063",
    orderId: "OM-10310",
    itemName: "Running Shoes – White (UK 9)",
    amount: 3799,
    reason: "Wrong size or fit",
    resolution: "Refund",
    requested: "22 Oct 2026",
    stage: 2,
  },
  {
    id: "RT-1987",
    orderId: "OM-10188",
    itemName: "Denim Jacket – Indigo (L)",
    amount: 2499,
    reason: "Not as described",
    resolution: "Refund",
    requested: "11 Sep 2026",
    stage: 4,
  },
];

const FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const ORDER_STEPS = [
  { label: "Placed", icon: ClipboardCheck },
  { label: "Packed", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

const returnSteps = (resolution) => [
  { label: "Requested", icon: ClipboardCheck },
  { label: "Pickup set", icon: CalendarCheck },
  { label: "Received", icon: PackageCheck },
  {
    label: resolution === "Exchange" ? "Replaced" : "Refunded",
    icon: Banknote,
  },
];

const RETURN_REASONS = [
  "Wrong size or fit",
  "Damaged or defective",
  "Not as described",
  "Received the wrong item",
  "Changed my mind",
].map((r) => ({ label: r, value: r }));

const returnSchema = Yup.object({
  item: Yup.string().required("Select the item you want to return"),
  reason: Yup.string().required("Select a reason"),
  resolution: Yup.string().required("Choose refund or exchange"),
  comments: Yup.string().max(300, "Keep it under 300 characters"),
});

const buildReturnFields = (order) => [
  {
    name: "item",
    label: "Item to return",
    type: "select",
    span: "full",
    required: true,
    placeholder: "Select an item",
    options: (order?.items ?? [])
      .filter((i) => !i.returned)
      .map((i) => ({ label: i.name, value: i.id })),
  },
  {
    name: "reason",
    label: "Reason",
    type: "select",
    span: "full",
    required: true,
    placeholder: "Select a reason",
    options: RETURN_REASONS,
  },
  {
    name: "resolution",
    label: "What would you like?",
    type: "radio",
    span: "full",
    required: true,
    default: "Refund",
    options: [
      { label: "Refund", value: "Refund" },
      { label: "Exchange", value: "Exchange" },
    ],
  },
  {
    name: "comments",
    label: "Comments",
    type: "textarea",
    span: "full",
    rows: 3,
    placeholder: "Tell us more (optional)",
  },
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const orderTotal = (o) => o.items.reduce((sum, i) => sum + i.price * i.qty, 0);

const STATUS_STYLES = {
  Processing: "border border-black",
  Shipped: "border border-black",
  Delivered: "bg-black text-white border border-black",
  Cancelled: "border border-black/30 text-neutral-500",
};

/* ---------- small pieces ---------- */
function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function Tracker({ steps, stage }) {
  return (
    <ol className="flex items-start">
      {steps.map((s, i) => {
        const done = i < stage;
        const current = i === stage;
        const Icon = s.icon;
        return (
          <li
            key={s.label}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {i > 0 && (
              <span
                className={`absolute left-[-50%] top-4 h-0.5 w-full ${
                  i <= stage ? "bg-black" : "bg-black/15"
                }`}
              />
            )}
            <span
              className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 ${
                done
                  ? "border-black bg-black text-white"
                  : current
                    ? "border-black bg-white"
                    : "border-black/20 bg-white text-neutral-400"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span
              className={`mt-2 text-[11px] sm:text-xs ${
                done || current ? "font-semibold" : "text-neutral-400"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- order card ---------- */
function OrderCard({ order, onCancel, onReturn }) {
  const hasReturnable = order.items.some((i) => !i.returned);
  const active = order.status === "Processing" || order.status === "Shipped";

  return (
    <article className="rounded-2xl border border-black/15 bg-white transition hover:border-black/60">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 p-5 sm:px-6">
        <div>
          <p className="font-bold">Order #{order.id}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Placed {order.placed}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <p className="text-sm font-bold">{inr(orderTotal(order))}</p>
        </div>
      </div>

      {/* items */}
      <ul className="divide-y divide-black/10 px-5 sm:px-6">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-black/15 bg-neutral-50">
              <Package className="h-6 w-6 text-neutral-400" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{item.name}</p>
              <p className="mt-0.5 text-xs text-neutral-500">Qty {item.qty}</p>
              {item.returned && (
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold">
                  <RotateCcw className="h-3 w-3" /> Return requested
                </span>
              )}
            </div>
            <p className="text-sm font-medium">{inr(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>

      {/* progress / status line */}
      <div className="border-t border-black/10 px-5 py-5 sm:px-6">
        {active && (
          <>
            <Tracker steps={ORDER_STEPS} stage={order.stage} />
            <p className="mt-4 text-center text-xs font-medium text-neutral-600">
              {order.eta}
            </p>
          </>
        )}
        {order.status === "Delivered" && (
          <p className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Delivered on {order.delivered}
            <span className="text-neutral-500">
              ·{" "}
              {order.canReturn && hasReturnable
                ? `Return by ${order.returnBy}`
                : `Return window closed ${order.returnBy}`}
            </span>
          </p>
        )}
        {order.status === "Cancelled" && (
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <X className="h-4 w-4" /> Cancelled on {order.cancelledOn}. Any
            payment is refunded to the original method.
          </p>
        )}
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-black/10 px-5 py-4 sm:px-6 ">
        {order.status === "Processing" && (
          <Button className="w-fit shadow-none">
            <X className="h-3 w-3" /> Cancel order
          </Button>
        )}
        {order.status === "Delivered" && order.canReturn && hasReturnable && (
          <Button className="w-fit shadow-none" onClick={onReturn}>
            <RotateCcw className="h-3 w-3" /> Return items
          </Button>
        )}
        {(order.status === "Delivered" || order.status === "Cancelled") && (
          <Button className="w-fit shadow-none" variant="secondary">
            <Repeat className="h-3 w-3" /> Buy again
          </Button>
        )}
        {order.status !== "Cancelled" && (
          <Button className="w-fit shadow-none" variant="secondary">
            <Download className="h-3 w-3" /> Invoice
          </Button>
        )}
      </div>
    </article>
  );
}

/* ---------- return card ---------- */
function ReturnCard({ ret }) {
  const done = ret.stage >= 4;
  return (
    <article className="rounded-2xl border border-black/15 bg-white transition hover:border-black/60">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 p-5 sm:px-6">
        <div>
          <p className="font-bold">Return #{ret.id}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Requested {ret.requested} · Order #{ret.orderId}
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold ${
            done
              ? "border border-black bg-black text-white"
              : "border border-black"
          }`}
        >
          {done
            ? ret.resolution === "Exchange"
              ? "Exchanged"
              : "Refunded"
            : "In progress"}
        </span>
      </div>

      <div className="flex items-center gap-4 p-5 sm:px-6">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-black/15 bg-neutral-50">
          <RotateCcw className="h-6 w-6 text-neutral-400" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{ret.itemName}</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Reason: {ret.reason}
          </p>
        </div>
        <p className="text-sm font-medium">
          {ret.resolution === "Exchange" ? "Exchange" : inr(ret.amount)}
        </p>
      </div>

      <div className="border-t border-black/10 px-5 py-5 sm:px-6">
        <Tracker steps={returnSteps(ret.resolution)} stage={ret.stage} />
      </div>
    </article>
  );
}

/* ---------- page ---------- */
export default function OrdersReturns() {
  const [orders, setOrders] = useState(initialOrders);
  const [returns, setReturns] = useState(initialReturns);
  const [tab, setTab] = useState("orders"); // "orders" | "returns"
  const [filter, setFilter] = useState("All");

  // cancel confirmation (target kept so the message stays stable while closing)
  const [cancelTarget, setCancelTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // return request panel
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const returnOrder = orders.find((o) => o.id === returnOrderId);

  const visibleOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const handleCancelResult = (confirmed) => {
    setConfirmOpen(false);
    if (!confirmed || !cancelTarget) return;
    setOrders((list) =>
      list.map((o) =>
        o.id === cancelTarget.id
          ? { ...o, status: "Cancelled", cancelledOn: "1 Nov 2026" }
          : o,
      ),
    );
  };

  const handleCreateReturn = (values) => {
    const item = returnOrder.items.find((i) => i.id === values.item);
    setReturns((list) => [
      {
        id: `RT-${Date.now().toString().slice(-4)}`,
        orderId: returnOrder.id,
        itemName: item.name,
        amount: item.price * item.qty,
        reason: values.reason,
        resolution: values.resolution,
        requested: "1 Nov 2026",
        stage: 1,
      },
      ...list,
    ]);
    setOrders((list) =>
      list.map((o) =>
        o.id === returnOrder.id
          ? {
              ...o,
              items: o.items.map((i) =>
                i.id === item.id ? { ...i, returned: true } : i,
              ),
            }
          : o,
      ),
    );
    setCreateOpen(false);
    setTab("returns");
  };

  const tabBtn = (key, label, count) => (
    <Button
      onClick={() => setTab(key)}
      className={`w-fit shadow-none
      }`}
      variant={"secondary"}
    >
      {label} ({count})
    </Button>
  );

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-1 sm:px-6">
        <BackButtonUser variant="secondary" />

        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Orders &amp; Returns
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track your orders, request returns and check refunds.
          </p>
        </header>

        {/* tabs */}
        <div className="mb-5 flex gap-2">
          {tabBtn("orders", "Orders", orders.length)}
          {tabBtn("returns", "Returns", returns.length)}
        </div>

        {tab === "orders" ? (
          <>
            {/* filters */}
            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    filter === f
                      ? "border-black bg-black text-white"
                      : "border-black/25 hover:border-black"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {visibleOrders.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onCancel={() => {
                    setCancelTarget(o);
                    setConfirmOpen(true);
                  }}
                  onReturn={() => {
                    setReturnOrderId(o.id);
                    setCreateOpen(true);
                  }}
                />
              ))}

              {visibleOrders.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-black/30 px-6 py-14 text-center">
                  <Package className="mx-auto h-8 w-8 text-neutral-400" />
                  <p className="mt-3 font-semibold">
                    No {filter.toLowerCase()} orders
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Orders with this status will show up here.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {returns.map((r) => (
              <ReturnCard key={r.id} ret={r} />
            ))}

            {returns.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-black/30 px-6 py-14 text-center">
                <RotateCcw className="mx-auto h-8 w-8 text-neutral-400" />
                <p className="mt-3 font-semibold">No returns yet</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Delivered orders can be returned from the Orders tab.
                </p>
                <Button
                  className="mx-auto mt-5 w-fit"
                  onClick={() => setTab("orders")}
                >
                  View orders
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <CreatePanel
        variant="user"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Return items"
        subtitle={returnOrder ? `Order #${returnOrder.id}` : undefined}
        fields={buildReturnFields(returnOrder)}
        validationSchema={returnSchema}
        submitLabel="Request return"
        onSubmit={handleCreateReturn}
      />

      <ConfirmProvider
        variant="user"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onResult={handleCancelResult}
      >
        Are you sure you want to cancel order #{cancelTarget?.id}? This can't be
        undone.
      </ConfirmProvider>
    </div>
  );
}
