import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/ui/SearchBar";
import P2 from "../../components/ui/P2";
import H1 from "../../components/ui/H1";
import CartSellerSeparation from "../../components/CartSellerSeparation";
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
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import { fetchCart, addCart, removeCart } from "../../redux/slice/cartSlice";

const getId = (val) => (val && typeof val === "object" ? val._id : val);

function Cart() {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [filterValues, setFilterValues] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    priceSort: "",
  });

  // raw cart entries: [{ productId, userId, sellerId, qnty }]
  const { cart, isCartLoading, cartError, cartStatus } = useSelector(
    (state) => state.cart,
  );

  console.log("CART FROM CART PAGE :", cart);

  const {
    products = [],
    productError,
    isProductLoading,
  } = useSelector((state) => state.product);
  const { seller } = useSelector((state) => state.seller);

  // TODO: adjust this path to match your real auth slice
  const userId = useSelector((state) => state.auth?.user?._id);

  // load the cart from the backend once we know who the user is
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart({ userId }));
    }
  }, [dispatch, userId]);

  const lastFetchedProductIdsRef = useRef("");
  const lastFetchedSellerIdsRef = useRef("");

  useEffect(() => {
    if (Array.isArray(cart) && cart.length > 0) {
      const uniqueProductIds = [
        ...new Set(cart.map((item) => getId(item.productId)).filter(Boolean)),
      ];
      const uniqueSellerIds = [
        ...new Set(cart.map((item) => getId(item.sellerId)).filter(Boolean)),
      ];

      const productIdsKey = uniqueProductIds.sort().join(",");
      const sellerIdsKey = uniqueSellerIds.sort().join(",");

      if (
        uniqueProductIds.length > 0 &&
        productIdsKey !== lastFetchedProductIdsRef.current
      ) {
        lastFetchedProductIdsRef.current = productIdsKey;
        dispatch(
          fetchAllProducts({
            pagination: { page: 1, limit: uniqueProductIds.length },
            uniqueProducts: uniqueProductIds,
          }),
        );
      }

      if (
        uniqueSellerIds.length > 0 &&
        sellerIdsKey !== lastFetchedSellerIdsRef.current
      ) {
        lastFetchedSellerIdsRef.current = sellerIdsKey;
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
        );
      }
    }
  }, [cart, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearProductError());
      dispatch(clearSellerError());
      dispatch(clearProductState());
      dispatch(clearSellerState());
    };
  }, []);

  const productMap = useMemo(() => {
    const map = {};
    (products || []).forEach((p) => {
      map[p._id] = p;
    });
    return map;
  }, [products]);

  const sellerMap = useMemo(() => {
    const map = {};
    (seller || []).forEach((s) => {
      map[s._id] = s;
    });
    return map;
  }, [seller]);

  const groups = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) return [];

    const bySeller = {};

    cart.forEach((cartItem) => {
      const product = productMap[getId(cartItem.productId)];
      const sellerData = sellerMap[getId(cartItem.sellerId)];

      if (!product) return;

      const sellerId = getId(cartItem.sellerId);
      const storeName = sellerData
        ? `${sellerData.firstName} ${sellerData.lastName}`
        : "Unknown Seller";

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

  // itemId here is the productId (see `id: product._id` above)

  const handleQtyChange = (productId, sellerId, newQty) => {
    if (newQty < 1) return;
    dispatch(addCart({ data: { userId, productId, sellerId, qnty: newQty } }));
  };

  const handleRemove = (productId) => {
    dispatch(removeCart({ productId }));
  };

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

      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 mt-8">
        <SearchBar
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          className={"border-black"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {cartStatus === "idle" || isCartLoading || isProductLoading ? (
        <div className="h-[70vh] w-full flex items-center justify-center">
          <CartLoading />
        </div>
      ) : cartError || productError ? (
        <ErrorFallback
          loading={isProductLoading}
          error={productError || cartError}
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
            filteredGroups={filteredGroups}
            groups={groups}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
          />
        </>
      )}
    </div>
  );
}

export default Cart;
