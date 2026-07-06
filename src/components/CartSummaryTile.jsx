import { Button } from "./ui/Button";
import P from "./ui/P";

function CartSummaryTile({ subtotal, shipping, total }) {
  return (
    <div className="mt-10 lg:mt-0 lg:sticky lg:top-24 rounded-lg border shadow-lg border-neutral-200 p-5 space-y-3">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Subtotal</span>
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-neutral-500">
          <span>Shipping</span>
          <span className="tabular-nums">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {shipping > 0 && (
          <P className="text-[11px] text-left text-neutral-400">
            Add ${(100 - subtotal).toFixed(2)} more for free shipping
          </P>
        )}
      </div>

      <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200">
        <span className="text-sm font-medium text-black">Total</span>
        <span className="text-lg font-semibold text-black tabular-nums">
          ${total.toFixed(2)}
        </span>
      </div>

      <Button>Checkout · ${total.toFixed(2)}</Button>
    </div>
  );
}

export default CartSummaryTile;
