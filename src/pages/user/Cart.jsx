import { useState, useMemo } from "react";
import { SearchBar } from "../../components/ui/SearchBar";
import { Minus, Plus, Trash2, Store, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/Button";
import P2 from "../../components/ui/P2";
import P from "../../components/ui/P";
import H1 from "../../components/ui/H1";

// Mock cart data — grouped by seller, since this is a multi-vendor cart
// and knowing which store an item ships from is real info, not decoration.
// Swap this for your Redux cart slice / API data once wired up.
const initialCart = [
  {
    store: "Northline Goods",
    items: [
      {
        id: "p1",
        name: "Wool Overshirt",
        variant: "Charcoal · M",
        category: "Clothing",
        price: 128,
        qty: 1,
        img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop",
      },
      {
        id: "p2",
        name: "Canvas Tote",
        variant: "Natural",
        category: "Accessories",
        price: 42,
        qty: 2,
        img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    store: "Aperture Supply Co.",
    items: [
      {
        id: "p3",
        name: "Ceramic Pour-Over Set",
        variant: "Matte Black",
        category: "Home",
        price: 64,
        qty: 1,
        img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
      },
    ],
  },
];

function Cart() {
  const [searchInput, setSearchInput] = useState("");
  const [filterValues, setFilterValues] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    priceSort: "",
  });
  const [groups, setGroups] = useState(initialCart);

  const updateQty = (storeIdx, itemId, delta) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i !== storeIdx
          ? g
          : {
              ...g,
              items: g.items.map((it) =>
                it.id === itemId
                  ? { ...it, qty: Math.max(1, it.qty + delta) }
                  : it,
              ),
            },
      ),
    );
  };

  const removeItem = (storeIdx, itemId) => {
    setGroups((prev) =>
      prev
        .map((g, i) =>
          i !== storeIdx
            ? g
            : { ...g, items: g.items.filter((it) => it.id !== itemId) },
        )
        .filter((g) => g.items.length > 0),
    );
  };

  // Apply search + filters client-side to the mock data.
  // Replace with server-side filtering once this reads from real cart data.
  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        let items = group.items.filter((item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase()),
        );

        if (filterValues.category) {
          items = items.filter(
            (item) =>
              item.category.toLowerCase() ===
              filterValues.category.toLowerCase(),
          );
        }
        if (filterValues.minPrice) {
          items = items.filter(
            (item) => item.price >= Number(filterValues.minPrice),
          );
        }
        if (filterValues.maxPrice) {
          items = items.filter(
            (item) => item.price <= Number(filterValues.maxPrice),
          );
        }
        if (filterValues.priceSort === "price_asc") {
          items = [...items].sort((a, b) => a.price - b.price);
        } else if (filterValues.priceSort === "price_desc") {
          items = [...items].sort((a, b) => b.price - a.price);
        }

        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, searchInput, filterValues]);

  const allItems = groups.flatMap((g) => g.items);
  const visibleItems = filteredGroups.flatMap((g) => g.items);
  const itemCount = allItems.reduce((s, it) => s + it.qty, 0);
  const subtotal = allItems.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 8) : 0;
  const total = subtotal + shipping;
  const isFiltering = searchInput || Object.values(filterValues).some(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full h-24"></div>
      <H1 className="text-center text-3xl font-semibold mt-8 text-black">
        Your Cart
      </H1>

      {/* Search and filter products in your cart: */}
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 mt-8">
        <SearchBar
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          className={"border-black"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {/* count of items and sellers */}
      <P2 className="text-neutral-500">
        {itemCount} {itemCount === 1 ? "item" : "items"} · {groups.length}{" "}
        {groups.length === 1 ? "store" : "stores"}
      </P2>

      {/* Display products in the cart based on search and filter values */}
      <div className="max-w-7xl mx-auto px-6 mt-2 pb-24 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start">
        {allItems.length === 0 ? (
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-lg border border-neutral-200 p-4 mb-4">
              <ShoppingBag
                size={28}
                strokeWidth={1.5}
                className="text-neutral-400"
              />
            </div>
            <P2 className="text-black">Cart's empty</P2>
            <P2 className="text-xs text-neutral-500 max-w-[240px]">
              Add something from any store on OmniMall and it'll show up here.
            </P2>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 text-center">
            <P className="text-sm font-medium text-black">No matches</P>
            <P2 className="text-xs text-neutral-500 max-w-[240px]">
              Nothing in your cart matches that search or filter.
            </P2>
          </div>
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
                      <div
                        key={item.id}
                        className="flex gap-4 rounded-lg border border-neutral-200 p-3 lg:p-4"
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-20 w-20 lg:h-24 lg:w-24 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <P2 className="font-medium text-left truncate">
                                {item.name}
                              </P2>
                              <P2 className="text-xs text-left text-neutral-500 mt-0.5">
                                {item.variant}
                              </P2>
                            </div>
                            <button
                              onClick={() => removeItem(storeIdx, item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="text-neutral-400 hover:text-black transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg p-1"
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center rounded-lg border border-neutral-200">
                              <button
                                onClick={() => updateQty(storeIdx, item.id, -1)}
                                aria-label="Decrease quantity"
                                className="p-1.5 text-neutral-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-l-lg"
                              >
                                <Minus size={12} strokeWidth={2} />
                              </button>
                              <span className="w-7 text-center text-xs font-medium text-black tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(storeIdx, item.id, 1)}
                                aria-label="Increase quantity"
                                className="p-1.5 text-neutral-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-r-lg"
                              >
                                <Plus size={12} strokeWidth={2} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-black tabular-nums">
                              ${(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary — sits below the list on mobile, sticky sidebar on desktop */}
        {allItems.length > 0 && !isFiltering && (
          <div className="mt-10 lg:mt-0 lg:sticky lg:top-24 rounded-lg border border-neutral-200 p-5 space-y-3">
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
        )}
      </div>
    </div>
  );
}

export default Cart;
