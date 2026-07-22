import { Plus, TriangleAlert } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductError,
  clearProductState,
  fetchAllProducts,
} from "../../redux/slice/productSlice";
import {
  fetchAllSellers,
  clearSellerError,
  clearSellerState,
} from "../../redux/slice/sellerSlice";
import {
  fetchAllCategories,
  clearCategoryError,
} from "../../redux/slice/categorySlice";
import CartLoading from "../../components/ui/CartLoading";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";
import ErrorFallback from "../../components/ui/ErrorFallback";
import SearchNotFound from "../../components/ui/SearchNotFound";
import { clearAuthError } from "../../redux/slice/authSlice";
import { useToastError } from "../../hooks/useToastError";
import DataTable from "../../components/ui/DataTable";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import { useNavigate } from "react-router-dom";

function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getId = (val) => (val && typeof val === "object" ? val._id : val);

  //product fetch
  const {
    products = [],
    isProductLoading,
    productError,
    hasNextPage,
  } = useSelector((state) => state.product);

  const { seller } = useSelector((state) => state.seller);
  const { category } = useSelector((state) => state.category);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openProduct, setOpenProduct] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [hadError, setHadError] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw input value
  const [isSearching, setIsSearching] = useState(false); //searching loading
  const [filterValues, setFilterValues] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    priceSort: "",
    sort: "",
  });

  // Fetch all products
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
    );
  }, [
    dispatch,
    page,
    search,
    filterValues.category,
    filterValues.minPrice,
    filterValues.maxPrice,
    filterValues.priceSort,
    filterValues.sort,
  ]);

  //click navigation
  useEffect(() => {
    if (openProduct && selectedProductId) {
      navigate(`/admin/products/${selectedProductId}`);
    }
  }, [openProduct, selectedProductId, navigate]);

  // error toast
  useEffect(() => {
    if (productError) {
      toast.error(productError);
      if (products.length !== 0) dispatch(clearProductError());
      dispatch(clearProductError());
    }
  }, [productError, dispatch]);

  const lastFetchedSellerIdsRef = useRef("");
  const lastFetchedCategoryIdsRef = useRef("");

  // infinite scrolling
  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: isProductLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  // search debounce
  useSearchDebounce({
    setSearch,
    setPage,
    searchInput,
    setIsSearching,
    isLoading: isProductLoading,
  });

  //seller and category fetch using ids in products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueSellerIds = [
        ...new Set(
          products
            .map((item) =>
              typeof item.sellerId === "object"
                ? item.sellerId._id
                : item.sellerId,
            )
            .filter(Boolean),
        ),
      ];
      const uniqueCategoryIds = [
        ...new Set(
          products
            .map((item) =>
              typeof item.categoryId === "object"
                ? item.categoryId._id
                : item.categoryId,
            )
            .filter(Boolean),
        ),
      ];

      const idsKey = uniqueSellerIds.sort().join(",");

      const idcKey = uniqueCategoryIds.sort().join(",");

      if (
        uniqueSellerIds.length > 0 &&
        idsKey !== lastFetchedSellerIdsRef.current
      ) {
        lastFetchedSellerIdsRef.current = idsKey;
        dispatch(
          fetchAllSellers({
            pagination: { page: 1, limit: uniqueSellerIds.length },
            uniqueSellers: uniqueSellerIds,
          }),
        );
      }
      if (
        uniqueCategoryIds.length > 0 &&
        idcKey !== lastFetchedCategoryIdsRef.current
      ) {
        lastFetchedCategoryIdsRef.current = idcKey;
        dispatch(
          fetchAllCategories({
            pagination: { page: 1, limit: uniqueCategoryIds.length },
            uniqueCategories: uniqueCategoryIds,
          }),
        );
      }
    }
  }, [products, dispatch]);
  // sellerId - seller, O(1) lookup instead of .find() inside the row loop
  const sellerMap = useMemo(() => {
    const map = {};
    (seller || []).forEach((item) => {
      map[item._id] = item;
    });
    return map;
  }, [seller]);

  const categoryMap = useMemo(() => {
    const map = {};
    (category || []).forEach((item) => {
      map[item._id] = item;
    });
    return map;
  }, [category]);

  // Top Selling stays fixed at the first 7 products ever fetched.
  // Locked via ref so it doesn't keep shifting as more pages load
  // through infinite scroll. "All Products" below still shows every
  // product, including these same 7 — no exclusion needed there.
  const topSellingRef = useRef(null);
  if (!topSellingRef.current && products.length >= 7) {
    topSellingRef.current = products.slice(0, 7);
  }
  const topSellingProducts = topSellingRef.current ?? products.slice(0, 7);

  useToastError({
    errorMessage: productError,
    fallbackErrorMessage: "Failed to log in",
  });
  useEffect(() => {
    setHadError(true);
    return () => {
      dispatch(clearAuthError());
    };
  }, []);

  const getSellerName = (sellerId) => {
    const s = sellerMap[getId(sellerId)];
    return s ? `${s.firstName} ${s.lastName}` : "Unknown Seller";
  };

  const isFirstLoad = isProductLoading && products.length === 0;
  const isLoadingMore =
    isProductLoading && products.length !== 0 && !isSearching;
  const isBusy = isSearching || isFirstLoad;

  //table columns
  const columns = [
    {
      header: "Image",
      render: (item) =>
        item.productImage?.length ? (
          <img
            src={item.productImage[0].url}
            alt={item.productName}
            className="w-12 h-12 rounded-md object-cover"
          />
        ) : (
          <TriangleAlert />
        ),
    },
    {
      header: "Product Name",
      render: (item) => (
        <>
          <p className="font-semibold">{item.productName}</p>
          <p className="text-xs text-gray-500">
            {categoryMap[getId(item.categoryId)]?.name}
          </p>
        </>
      ),
    },
    {
      header: "Seller",
      render: (item) => <div>{getSellerName(item.sellerId)}</div>,
    },
    {
      header: "Stock",
      accessor: "stock",
    },
    {
      header: "MRP",
      render: (item) => `₹ ${item.mrp}`,
    },
    {
      header: "Seller Price",
      render: (item) => `₹ ${item.offerPrice}`,
    },
  ];

  useEffect(() => {
    return () => {
      dispatch(clearProductError);
      dispatch(clearSellerError);
      dispatch(clearProductState);
      dispatch(clearSellerState);
    };
  }, []);

  return (
    <>
      <div className="flex items-center">
        <div
          className={`${openProduct || addProduct ? "scale-100" : "scale-0"} transition-all duration-500 fixed inset-0 z-50 flex items-center justify-center`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setOpenProduct(false);
              setAddProduct(false);
            }
          }}
        ></div>
        <div className="w-full">
          <SearchBar
            colorVariants="admin"
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-start">
        <Button
          className={"bg-[#5f0000] w-fit px-4"}
          onClick={() => {
            setAddProduct(true);
            setOpenProduct(false);
          }}
        >
          <Plus /> Add Products
        </Button>
      </div>
      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
        <div className="w-full flex-1 overflow-y-auto px-4 pb-4 custom-scrollBar">
          {isBusy && !productError && (
            <div className="w-full h-[65vh] flex items-center justify-center">
              <CartLoading />
            </div>
          )}

          {!isBusy && !productError && products.length !== 0 && (
            <>
              <DataTable
                title="All Products"
                columns={columns}
                data={products}
                onRowClick={(item) => {
                  setOpenProduct(true);
                  setAddProduct(false);
                  setSelectedProductId(item._id);
                  setSingleProduct({
                    ...item,
                    sellerData: sellerMap[getId(item.sellerId)] ?? null,
                    categoryData: categoryMap[getId(item.categoryId)] ?? null,
                  });
                }}
                footer={<div id={triggerId} className="h-5" />}
              />
            </>
          )}
          <ErrorFallback loading={isBusy} error={productError} />

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

          <div id={triggerId} className="h-5" />
        </div>
      </div>
    </>
  );
}

export default Products;
