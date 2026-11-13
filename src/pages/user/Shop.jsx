import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductError,
  fetchAllProducts,
} from "../../redux/slice/productSlice";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "../../components/ui/ProductCard";
import CartLoading from "../../components/ui/CartLoading";
import { useInfiniteScroll } from "../../hooks/useInfiniteScrolling";
import Loading from "../../components/ui/Loading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import SearchNotFound from "../../components/ui/SearchNotFound";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import H1 from "../../components/ui/H1";
import P2 from "../../components/ui/P2";

function Shop() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [searchInput, setSearchInput] = useState(""); // raw input value
  const [isSearching, setIsSearching] = useState(false); // searching loading
  const [hasFetched, setHasFetched] = useState(false); // first request finished
  const [filterValues, setFilterValues] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    priceSort: "",
  });

  const {
    products = [],
    isProductLoading,
    productError,
    hasNextPage,
    totalProducts,
  } = useSelector((state) => state.product);

  // retry only the products slice: back to page 1 and re-run the fetch effect
  const handleRetry = useCallback(() => {
    setPage(1);
    setRetryKey((k) => k + 1);
  }, []);

  const triggerRef = useInfiniteScroll({
    hasNextPage: hasNextPage && !productError,
    isLoading: isProductLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
    recheckKey: page,
  });

  // search debounce
  useSearchDebounce({
    setSearch,
    setPage,
    searchInput,
    setIsSearching,
    isLoading: isProductLoading,
  });

  useEffect(() => {
    setPage(1);
  }, [
    filterValues.category,
    filterValues.minPrice,
    filterValues.maxPrice,
    filterValues.priceSort,
  ]);

  // Fetch
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        pagination: {
          page,
          limit: 15,
          search,
          category: filterValues.category,
          minPrice: filterValues.minPrice,
          maxPrice: filterValues.maxPrice,
          priceSort: filterValues.priceSort,
        },
      }),
    ).finally(() => setHasFetched(true));
  }, [
    dispatch,
    page,
    search,
    retryKey,
    filterValues.category,
    filterValues.minPrice,
    filterValues.maxPrice,
    filterValues.priceSort,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch]);

  const isFirstLoad =
    (isProductLoading && products.length === 0) || !hasFetched;
  const isLoadingMore =
    isProductLoading && products.length !== 0 && !isSearching;
  const isBusy = isSearching || isFirstLoad;

  return (
    <div>
      <div className="w-full h-24"></div>
      <H1>Shop In Your Choice</H1>
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 mt-8">
        <SearchBar
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          className={"border-black"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 mt-8 pb-4">
        {/* initial load or searching */}
        {isBusy && !productError && (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <CartLoading />
          </div>
        )}

        {/* products, also shown while loading more pages */}
        {!isBusy && !productError && products.length !== 0 && (
          <>
            <div className="px-2 xs:px-8 pb-10">
              <ProductCard products={products} />
            </div>
          </>
        )}

        {/* error: retry refetches only the products */}
        {!isBusy && productError && (
          <ErrorFallback
            loading={isBusy}
            error={productError}
            onRetry={handleRetry}
          />
        )}

        {/* no results */}
        {!isBusy && !productError && products.length === 0 && (
          <SearchNotFound search={search} />
        )}

        {/* infinite scroll loader, below the products */}
        {isLoadingMore && (
          <div className="flex justify-center py-6">
            <Loading className={"size-6"} />
          </div>
        )}

        {!productError && products.length > 0 && (
          <div ref={triggerRef} className="h-10" />
        )}
      </div>
    </div>
  );
}

export default Shop;
