import { Tag } from "lucide-react";
import { Button } from "../ui/Button";
import { inputCls } from "./Constant";

export default function CouponBox({
  coupon,
  input,
  error,
  onInputChange,
  onApply,
  onRemove,
}) {
  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-black bg-black/[0.03] px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <Tag className="h-4 w-4" /> {coupon.code}
          <span className="font-normal text-neutral-500">({coupon.label})</span>
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs underline underline-offset-4 hover:opacity-60"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <input
          className={inputCls}
          placeholder="Coupon code (try SAVE10)"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <Button className="w-fit" onClick={onApply}>
          Apply
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </>
  );
}
