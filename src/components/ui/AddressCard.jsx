import {
  Briefcase,
  Check,
  Home,
  MapPin,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";
import { Button } from "./Button";

const labelIcons = { home: Home, work: Briefcase, other: MapPin };

/* ---------- address card ---------- */
export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  disabled,
  order = false,
}) {
  const Icon = labelIcons[address.label] ?? MapPin;

  return (
    <article
      className={`rounded-2xl border bg-white p-5 transition sm:p-6 ${
        address.isDefault
          ? "border-black"
          : "border-black/15 hover:border-black/60"
      }`}
    >
      <div className="flex gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black">
          <Icon className="h-5 w-5" strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">{address.label}</h3>
            {address.isDefault && (
              <span className="flex items-center gap-1 rounded-full bg-black px-2.5 py-0.5 text-[11px] font-semibold text-white">
                <Check className="h-3 w-3" /> Default
              </span>
            )}
          </div>

          <p className="mt-2 text-sm font-semibold">{address.name}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
            <br />
            {address.city}, {address.state} {address.pincode}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
            <Phone className="h-3.5 w-3.5" /> {address.phone}
          </p>
        </div>
      </div>
      {!order && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4 sm:pl-[60px]">
          <Button onClick={onEdit} className="w-fit">
            <Pencil className="h-3 w-3" /> Edit
          </Button>
          {!address.isDefault && (
            <Button
              onClick={onDelete}
              variant="secondary"
              className="text-red-400 hover:text-red-500 w-fit"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          )}
          {!address.isDefault && (
            <button
              disabled={disabled}
              onClick={onSetDefault}
              className="ml-auto text-xs font-semibold underline underline-offset-4 hover:opacity-60"
            >
              Set as default
            </button>
          )}
        </div>
      )}
    </article>
  );
}
