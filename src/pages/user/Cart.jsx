import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SearchBar } from "../../components/ui/SearchBar";
import P2 from "../../components/ui/P2";
import H1 from "../../components/ui/H1";
import CartSellerSeparation from "../../components/CartSellerSeparation";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import { useInfiniteScroll } from "../../hooks/useInfiniteScrolling";
import {
  fetchAllProducts,
  clearProductError,
  clearProductState,
} from "../../redux/slice/productSlice";
import {
  fetchAllSellers,
  clearSellerError,
  clearSellerState,
} from "../../redux/slice/sellerSlice";
import {
  clearCartError,
  clearCartMessages,
  fetchCart,
  removeCart,
  updateQuantity,
} from "../../redux/slice/cartSlice";

const PAGE_SIZE = 10;

const getId = (val) => (val && typeof val === "object" ? val._id : val);

function Cart() {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [settledKey, setSettledKey] = useState("");
  const [filterValues, setFilterValues] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    priceSort: "",
  });

  const {
    cart,
    isCartLoading,
    cartError,
    cartStatus,
    cartUpdateMessage,
    cartDeleteMessage,
  } = useSelector((state) => state.cart);

  const {
    products = [],
    productError,
    isProductLoading,
  } = useSelector((state) => state.product);

  // `sellers` = list key (if your slice has one), `seller` = may be a single object
  const { sellers, seller, sellerError } = useSelector((state) => state.seller);

  const hasCartData = Array.isArray(cart) && cart.length > 0;

  const lastFetchedProductIdsRef = useRef("");
  const lastFetchedSellerIdsRef = useRef("");

  // identifies "which products + sellers this cart needs"
  const cartKey = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) return "";
    const p = [...new Set(cart.map((i) => getId(i.productId)).filter(Boolean))]
      .sort()
      .join(",");
    const s = [...new Set(cart.map((i) => getId(i.sellerId)).filter(Boolean))]
      .sort()
      .join(",");
    return `${p}|${s}`;
  }, [cart]);

  /* ------------------------------ fetching ------------------------------ */

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(cart) || cart.length === 0) return;

    const uniqueProductIds = [
      ...new Set(cart.map((item) => getId(item.productId)).filter(Boolean)),
    ];
    const uniqueSellerIds = [
      ...new Set(cart.map((item) => getId(item.sellerId)).filter(Boolean)),
    ];

    const productIdsKey = [...uniqueProductIds].sort().join(",");
    const sellerIdsKey = [...uniqueSellerIds].sort().join(",");
    const jobs = [];

    if (
      uniqueProductIds.length > 0 &&
      productIdsKey !== lastFetchedProductIdsRef.current
    ) {
      lastFetchedProductIdsRef.current = productIdsKey;
      jobs.push(
        dispatch(
          fetchAllProducts({
            pagination: { page: 1, limit: uniqueProductIds.length },
            uniqueProducts: uniqueProductIds,
          }),
        ),
      );
    }

    if (
      uniqueSellerIds.length > 0 &&
      sellerIdsKey !== lastFetchedSellerIdsRef.current
    ) {
      lastFetchedSellerIdsRef.current = sellerIdsKey;
      jobs.push(
        dispatch(
          fetchAllSellers({
            pagination: { page: 1, limit: uniqueSellerIds.length },
            uniqueSellers: uniqueSellerIds,
            search: "",
            category: "",
            minPrice: null,
            maxPrice: null,
            priceSort: "",
          }),
        ),
      );
    }

    if (jobs.length > 0) {
      // allSettled: runs whether the fetches succeed or fail
      Promise.allSettled(jobs).then(() => setSettledKey(cartKey));
    }
  }, [cart, cartKey, dispatch]);

  /* ------------------------------- toasts ------------------------------- */

  useEffect(() => {
    if (cartDeleteMessage) {
      toast.success(cartDeleteMessage);
      dispatch(clearCartMessages());
    }
    if (cartUpdateMessage) {
      toast.success(cartUpdateMessage);
      dispatch(clearCartMessages());
    }
    // failed update/remove (cart on screen) -> toast
    // failed load (nothing to show) -> ErrorFallback
    if (cartError && hasCartData) {
      toast.error(cartError);
      dispatch(clearCartError());
    }
  }, [dispatch, cartDeleteMessage, cartUpdateMessage, cartError, hasCartData]);

  /* ------------------------------ cleanup ------------------------------- */

  useEffect(() => {
    return () => {
      dispatch(clearProductError());
      dispatch(clearSellerError());
      dispatch(clearProductState());
      dispatch(clearSellerState());
      dispatch(clearCartMessages());
    };
  }, [dispatch]);

  /* ------------------------------- retry -------------------------------- */

  const handleRetry = () => {
    lastFetchedProductIdsRef.current = "";
    lastFetchedSellerIdsRef.current = "";
    setSettledKey(""); // <- new
    dispatch(clearProductError());
    dispatch(clearSellerError());
    dispatch(clearCartError());
    setPage(1);
    dispatch(fetchCart());
  };

  /* ------------------------------ derived data -------------------------- */

  const productMap = useMemo(() => {
    const map = {};
    (Array.isArray(products) ? products : []).forEach((p) => {
      map[p._id] = p;
    });
    return map;
  }, [products]);

  // never call .forEach on something that might be a single object or null
  const sellerMap = useMemo(() => {
    const list = Array.isArray(sellers)
      ? sellers
      : Array.isArray(seller)
        ? seller
        : [];
    const map = {};
    list.forEach((s) => {
      map[s._id] = s;
    });
    return map;
  }, [sellers, seller]);

  const groups = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) return [];

    const bySeller = {};

    cart.forEach((cartItem) => {
      const product = productMap[getId(cartItem.productId)];
      const sellerData = sellerMap[getId(cartItem.sellerId)];

      if (!product) return;

      const sellerId = getId(cartItem.sellerId);
      const storeName =
        sellerData?.storeName ??
        (sellerData?.firstName
          ? `${sellerData.firstName} ${sellerData.lastName ?? ""}`.trim()
          : "Unknown Seller");

      if (!bySeller[sellerId]) {
        bySeller[sellerId] = { store: storeName, sellerId, items: [] };
      }

      bySeller[sellerId].items.push({
        id: product._id,
        name: product.productName,
        variant: product.variant || "",
        category: product.categoryId?.name || "",
        price: product.offerPrice,
        qty: cartItem.qnty,
        img: product.productImage?.[0]?.url,
      });
    });

    return Object.values(bySeller);
  }, [cart, productMap, sellerMap]);

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

  /* --------------------------- infinite scroll -------------------------- */

  useEffect(() => {
    setPage(1);
  }, [searchInput, filterValues]);

  const pagedGroups = useMemo(() => {
    let remaining = page * PAGE_SIZE;
    const out = [];
    for (const group of filteredGroups) {
      if (remaining <= 0) break;
      const items = group.items.slice(0, remaining);
      remaining -= items.length;
      out.push({ ...group, items });
    }
    return out;
  }, [filteredGroups, page]);

  const hasMore = visibleItems.length > page * PAGE_SIZE;

  const triggerRef = useInfiniteScroll({
    hasNextPage: hasMore,
    isLoading: false,
    onLoadMore: () => setPage((p) => p + 1),
    recheckKey: page,
  });

  /* ------------------------------- handlers ----------------------------- */

  const handleQtyChange = (productId, newQty) => {
    if (newQty < 0) return;
    dispatch(updateQuantity({ data: { productId, qnty: newQty } }));
  };

  const handleRemove = (productId) => {
    dispatch(removeCart({ productId }));
  };

  /* -------------------------------- render ------------------------------ */

  const isHydrating = hasCartData && settledKey !== cartKey;
  const isLoading =
    cartStatus === "idle" || isCartLoading || isProductLoading || isHydrating;
  const hasError = (cartError && !hasCartData) || productError;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full h-24"></div>
      <H1 className="text-center text-3xl font-semibold mt-8 text-black">
        Your Cart
      </H1>

      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 mt-8">
        <SearchBar
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          className={"border-black"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="h-[70vh] w-full flex items-center justify-center">
          <CartLoading />
        </div>
      ) : hasError ? (
        <ErrorFallback
          error={productError || sellerError || cartError}
          onRetry={handleRetry}
        />
      ) : (
        <>
          <P2 className="text-neutral-500">
            {itemCount} {itemCount === 1 ? "item" : "items"} · {groups.length}{" "}
            {groups.length === 1 ? "store" : "stores"}
          </P2>

          <CartSellerSeparation
            allItems={allItems}
            visibleItems={visibleItems}
            isFiltering={isFiltering}
            filteredGroups={pagedGroups}
            groups={groups}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
          />

          {hasMore && <div ref={triggerRef} className="h-10" />}
        </>
      )}
    </div>
  );
}

export default Cart;
