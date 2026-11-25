import { useState } from "react";
import { Package, RotateCcw } from "lucide-react";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import { CreatePanel } from "./ui/CreatePanel";
import ConfirmProvider from "./ui/ConfirmProvider";
import { returnOrderSchema } from "../validation/returnOrderSchema";
import ReturnCard from "./ui/ReturnCard";
import OrderCard from "./ui/OrderCard";
import { useSelector } from "react-redux";

/* ---------- static data ---------- */

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

const RETURN_REASONS = [
  "Wrong size or fit",
  "Damaged or defective",
  "Not as described",
  "Received the wrong item",
  "Changed my mind",
].map((r) => ({ label: r, value: r }));

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

/* ---------- page ---------- */
export default function OrdersReturns() {
  const [returns, setReturns] = useState(initialReturns);
  const [tab, setTab] = useState("orders"); // "orders" | "returns"
  const [filter, setFilter] = useState("All");

  const { orders, isOrderLoading, orderError } = useSelector(
    (state) => state.order,
  );

  // cancel confirmation (target kept so the message stays stable while closing)
  const [cancelTarget, setCancelTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // return request panel
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const returnOrder = orders.find((o) => o.id === returnOrderId);

  const visibleOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

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
        validationSchema={returnOrderSchema}
        submitLabel="Request return"
        // onSubmit={handleCreateReturn}
      />

      <ConfirmProvider
        variant="user"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        // onResult={handleCancelResult}
      >
        Are you sure you want to cancel order #{cancelTarget?.id}? This can't be
        undone.
      </ConfirmProvider>
    </div>
  );
}
