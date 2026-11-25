import {
  Banknote,
  CalendarCheck,
  ClipboardCheck,
  PackageCheck,
  RotateCcw,
} from "lucide-react";
import ProductTracker from "./ProductTracker";
import { useCurrency } from "../../hooks/useCurrency";

const returnSteps = (resolution) => [
  { label: "Requested", icon: ClipboardCheck },
  { label: "Pickup set", icon: CalendarCheck },
  { label: "Received", icon: PackageCheck },
  {
    label: resolution === "Exchange" ? "Replaced" : "Refunded",
    icon: Banknote,
  },
];

/* ---------- return card ---------- */
export default function ReturnCard({ ret }) {
  const done = ret.stage >= 4;
  const inr = useCurrency();
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
        <ProductTracker steps={returnSteps(ret.resolution)} stage={ret.stage} />
      </div>
    </article>
  );
}
