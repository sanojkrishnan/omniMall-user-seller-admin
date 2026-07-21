import { Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCoupon } from "../../redux/slice/couponSlice";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import SearchNotFound from "../../components/ui/SearchNotFound";
import Loading from "../../components/ui/Loading";
import SingleCouponDetail from "../../components/SingleCouponDetail";
import { useNavigate } from "react-router-dom";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const columns = [
  {
    header: "Coupon Name",
    render: (item) => <div>{item.name || "N/A"}</div>,
  },
  {
    header: "Coupon Code",
    render: (item) => <div>{item?.code || "N/A"}</div>,
  },
  {
    header: "Discount Type",
    render: (item) => <div>{item?.discountType || "N/A"}</div>,
  },
  {
    header: "Discount Value",
    render: (item) => <div>{item?.discountValue || "N/A"}</div>,
  },
  {
    header: "Start Date",
    render: (item) => <div>{formatDate(item?.startDate) || "N/A"}</div>,
  },
  {
    header: "End Date",
    render: (item) => <div>{formatDate(item?.endDate) || "N/A"}</div>,
  },
];

function Coupon() {
  const {
    coupon = [],
    isCouponLoading,
    couponError,
    hasNextPage,
  } = useSelector((state) => state.coupon);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw input value
  const [isSearching, setIsSearching] = useState(false); //searching loading
  const [openCoupon, setOpenCoupon] = useState(false);
  const [addCoupon, setAddCoupon] = useState(false);
  const [filterValues, setFilterValues] = useState({
    sort: "newest",
  });

  // Fetch all coupons
  useEffect(() => {
    dispatch(
      fetchCoupon({
        pagination: {
          page,
          limit: 15,
          search,
          sort: filterValues.sort,
        },
      }),
    );
  }, [dispatch, page, search, filterValues.sort]);


  //click navigation
  useEffect(() => {
    if (openCoupon && selectedCouponId) {
      navigate(`/admin/coupon/${selectedCouponId}`);
    }
  }, [openCoupon, selectedCouponId, navigate]);

  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: isCouponLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });
  useSearchDebounce({
    setSearch,
    setPage,
    searchInput,
    setIsSearching,
    isLoading: isCouponLoading,
  });

  const isFirstLoad = isCouponLoading && coupon.length === 0;
  const isLoadingMore = isCouponLoading && coupon.length !== 0 && !isSearching;
  const isBusy = isSearching || isFirstLoad;

  return (
    <div className="w-full">
      <Button
        className={"bg-[#5f0000] w-fit px-4"}
        onClick={() => {
          setAddCoupon(true);
          setOpenCoupon(false);
        }}
      >
        <Plus /> Add Coupon
      </Button>
      <SearchBar
        colorVariants="admin"
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"categories"}
      />
      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] justify-between">
        <div className="w-full flex-1 overflow-y-auto px-4 pb-4 custom-scrollBar">
          {isBusy && !couponError && (
            <div className="w-full h-[65vh] flex items-center justify-center">
              <CartLoading />
            </div>
          )}

          {!isBusy && !couponError && coupon.length !== 0 && (
            <>
              <DataTable
                title="All Coupons"
                columns={columns}
                data={coupon}
                onRowClick={(item) => {
                  setSelectedCouponId(item._id);
                  setOpenCoupon(true);
                  setAddCoupon(false);
                }}
                footer={<div id={triggerId} className="h-5" />}
              />
            </>
          )}
          <ErrorFallback loading={isBusy} error={couponError} />

          {/* no results */}
          {!isBusy && !couponError && coupon.length === 0 && (
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
    </div>
  );
}

export default Coupon;
