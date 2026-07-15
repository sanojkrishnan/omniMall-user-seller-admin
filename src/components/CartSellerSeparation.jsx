import { Store } from "lucide-react";
import CartSummaryTile from "./CartSummaryTile";
import CartProductCard from "./CartProductCard";
import ErrorFallback from "./ui/ErrorFallback";

function CartSellerSeparation({
  allItems,
  visibleItems,
  isFiltering,
  filteredGroups,
  groups,
  subtotal,
  shipping,
  total,
  onQtyChange,
  onRemove,
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-2 pb-24 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start">
      {allItems.length === 0 ? (
        <ErrorFallback item="cart_empty" />
      ) : visibleItems.length === 0 ? (
        <ErrorFallback item="cart_notMatch" />
      ) : (
        <div className={`space-y-7 ${isFiltering ? "lg:col-span-2" : ""}`}>
          {filteredGroups.map((group) => {
            const storeIdx = groups.findIndex((g) => g.store === group.store);
            return (
              <div key={group.store}>
                <div className="flex items-center gap-1.5 mb-3">
                  <Store
                    size={12}
                    strokeWidth={2}
                    className="text-neutral-400"
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    {group.store}
                  </span>
                </div>

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <CartProductCard
                      key={item.id}
                      item={item}
                      storeIdx={storeIdx}
                      sellerId={group.sellerId}
                      onQtyChange={onQtyChange}
                      onRemove={onRemove}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary — sits below the list on mobile, sticky sidebar on desktop */}
      {allItems.length > 0 && !isFiltering && (
        <CartSummaryTile
          subtotal={subtotal}
          shipping={shipping}
          total={total}
        />
      )}
    </div>
  );
}

export default CartSellerSeparation;
