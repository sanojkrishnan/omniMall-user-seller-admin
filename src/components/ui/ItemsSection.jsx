import { Minus, Plus } from "lucide-react";
import Section from "./Section";
import { useCurrency } from "../../hooks/useCurrency";

export default function ItemsSection({
  step,
  product,
  qty,
  loading,
  error,
  onChangeQty,
}) {
  const inr = useCurrency();
  return (
    <Section step={step} title="Review item">
      {loading ? (
        <p className="py-6 text-center text-sm text-neutral-500">
          Loading product...
        </p>
      ) : error ? (
        <p className="py-6 text-center text-sm text-red-500">
          {typeof error === "string" ? error : "Could not load product"}
        </p>
      ) : !product ? (
        <p className="py-6 text-center text-sm text-neutral-500">
          Product not found.
        </p>
      ) : (
        <div className="flex gap-4">
          <img
            src={product.productImage?.[0]?.url ?? product.productImage?.[0]}
            alt={product.productName}
            className="h-20 w-20 shrink-0 rounded-xl border border-black/15 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug">{product.productName}</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Brand: {product.brand}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center rounded-full border border-black/20">
                <button
                  type="button"
                  onClick={() => onChangeQty(-1)}
                  className="grid h-8 w-8 place-items-center hover:opacity-60"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeQty(1)}
                  className="grid h-8 w-8 place-items-center hover:opacity-60"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-right">
                <span className="font-bold">
                  {inr(product.offerPrice * qty)}
                </span>
                <span className="ml-2 text-xs text-neutral-400 line-through">
                  {inr(product.mrp * qty)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
