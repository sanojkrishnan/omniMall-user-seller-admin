import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductError,
  fetchAllProducts,
} from "../../redux/slice/productSlice";
import { useEffect, useState, useRef } from "react";
import ProductCard from "../../components/ui/ProductCard";
import CartLoading from "../../components/ui/CartLoading";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";
import Loading from "../../components/ui/Loading";
import { toast } from "react-toastify";
import ErrorFallback from "../../components/ui/ErrorFallback";
import SearchNotFound from "../../components/ui/SearchNotFound";

function Shop() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw input value
  const [isSearching, setIsSearching] = useState(false); //searching loading
  const [filterValues, setFilterValues] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    priceSort: "",
  });

  //product fetch
  const {
    products = [],
    isProductLoading,
    productError,
    totalPages,
    hasNextPage,
  } = useSelector((state) => state.product);

  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: isProductLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  const isFirstRender = useRef(true);

  // Debounce — only sets isSearching false AFTER fetch completes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
      // don't setIsSearching(false) here — wait for fetch to finish
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Clear isSearching only after fetch completes
  useEffect(() => {
    if (!isProductLoading) {
      setIsSearching(false);
    }
  }, [isProductLoading]);

  // Fetch
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        page,
        limit: 15,
        search,
        category: filterValues.category,
        minPrice: filterValues.minPrice,
        maxPrice: filterValues.maxPrice,
        priceSort: filterValues.priceSort,
      }),
    );
  }, [
    dispatch,
    page,
    search,
    filterValues.category,
    filterValues.minPrice,
    filterValues.maxPrice,
    filterValues.priceSort,
  ]);

  // error toast
  useEffect(() => {
    if (productError) {
      toast.error(productError);
      if (products.length !== 0) dispatch(clearProductError());
      clearProductError();
    }
  }, [productError, dispatch]);

  const isFirstLoad = isProductLoading && products.length === 0;
  const isLoadingMore =
    isProductLoading && products.length !== 0 && !isSearching;
  const isBusy = isSearching || isFirstLoad;

  return (
    <div>
      <div className="w-full h-24"></div>
      <h1 className="text-center text-3xl font-semibold mt-8">
        Shop In Your Choice
      </h1>
      <SearchBar
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        className={"border-black"}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <div>
        {/* initial load or searching */}
        {isBusy && !productError && (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <CartLoading />
          </div>
        )}

        {/* products — also shows while loading more pages */}
        {!isBusy && !productError && products.length !== 0 && (
          <div className="px-8 pb-10">
            <ProductCard products={products} />
          </div>
        )}

        {/* error */}
        {!isBusy && productError && <ErrorFallback />}

        {/* no results */}
        {!isBusy && !productError && products.length === 0 && (
          <SearchNotFound search={search} />
        )}

        {/* infinite scroll loader — below products, not replacing them */}
        {isLoadingMore && (
          <div className="flex justify-center py-6">
            <Loading className={"size-6"} />
          </div>
        )}

        <div id={triggerId} className="h-10" />
      </div>
    </div>
  );
}

export default Shop;
