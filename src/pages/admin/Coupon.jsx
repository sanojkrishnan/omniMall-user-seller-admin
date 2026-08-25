import { Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";
import { useInfiniteScroll } from "../../hooks/useInfiniteScrolling";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addCoupon, fetchCoupon } from "../../redux/slice/couponSlice";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import SearchNotFound from "../../components/ui/SearchNotFound";
import Loading from "../../components/ui/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreatePanel } from "../../components/ui/CreatePanel";
import { couponSchema } from "../../validation/couponSchema";
import { getErrorMessage } from "../../utils/getErrorMessage";

//fields for coupon adding
const COUPON_FIELDS = [
  { name: "name", label: "Coupon Name", type: "text", required: true },

  {
    name: "code",
    label: "Coupon Code",
    type: "text",
    required: true,
  },

  {
    name: "description",
    label: "Description",
    type: "textarea",
    span: "full",
    required: true,
  },

  {
    name: "discountType",
    label: "Discount Type",
    type: "select",
    required: true,
    options: [
      { value: "percentage", label: "Percentage" },
      { value: "flat", label: "Flat" },
    ],
  },

  {
    name: "discountValue",
    label: "Discount Value",
    type: "number",
    required: true,
    min: 0,
  },

  {
    name: "maxDiscount",
    label: "Maximum Discount",
    type: "number",
    min: 0,
  },

  {
    name: "minOrderAmount",
    label: "Minimum Order Amount",
    type: "number",
    required: true,
    min: 0,
  },

  {
    name: "startDate",
    label: "Start Date",
    type: "datetime-local",
    required: true,
  },

  {
    name: "endDate",
    label: "End Date",
    type: "datetime-local",
    required: true,
  },

  {
    name: "usageLimit",
    label: "Usage Limit",
    type: "number",
    required: true,
    min: 1,
  },

  {
    name: "usagePerUser",
    label: "Usage Per User",
    type: "number",
    required: true,
    min: 1,
  },

  {
    name: "eligibleUsers",
    label: "Eligible Users",
    type: "select",
    required: true,
    options: [
      { value: "all", label: "All Users" },
      { value: "new", label: "New Users" },
      { value: "existing", label: "Existing Users" },
    ],
  },

  {
    name: "paymentMethods",
    label: "Payment Methods",
    type: "multiselect",
    options: [
      { value: "COD", label: "Cash on Delivery" },
      { value: "CARD", label: "Card" },
      { value: "UPI", label: "UPI" },
    ],
  },
  {
    name: "applicableProducts",
    label: "Applicable Products",
    type: "async-multiselect",
    asyncEntity: "product",
    span: "full",
  },
  {
    name: "applicableCategories",
    label: "Applicable Categories",
    type: "async-multiselect",
    asyncEntity: "category",
    span: "full",
  },
  {
    name: "excludedProducts",
    label: "Excluded Products",
    type: "async-multiselect",
    asyncEntity: "product",
    span: "full",
  },
  {
    name: "sellerIds",
    label: "Applicable Sellers",
    type: "async-multiselect",
    asyncEntity: "seller",
    span: "full",
  },
  {
    name: "stackable",
    label: "Stackable",
    type: "checkbox",
  },

  {
    name: "autoApply",
    label: "Auto Apply",
    type: "checkbox",
  },
];

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
    render: (item) => <div className="text-sm text-[#5B4650]">{item?.discountType || "N/A"}</div>,
  },
  {
    header: "Discount Value",
    render: (item) => <div className="text-sm text-[#5B4650]">{item?.discountValue || "N/A"}</div>,
  },
  {
    header: "Start Date",
    render: (item) => <div className="text-sm text-[#5B4650]">{formatDate(item?.startDate) || "N/A"}</div>,
  },
  {
    header: "End Date",
    render: (item) => <div className="text-sm text-[#5B4650]">{formatDate(item?.endDate) || "N/A"}</div>,
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
  const [createCoupon, setCreateCoupon] = useState(false);
  const [createError, setCreateError] = useState(null);
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

  //handle add click
  async function handleCreateSubmit(values) {
    try {
      setCreateError(null);
      await dispatch(addCoupon({ data: values })).unwrap();
      toast.success("Coupon created");
      setCreateCoupon(false);
    } catch (err) {
      // .unwrap() throws action.payload directly (whatever extractError
      // returned) — not an Error instance — so `err?.message` was silently
      // undefined whenever extractError returns a plain string, and the
      // toast always fell back to the generic message. getErrorMessage
      // handles both string and object shapes.
      const message = getErrorMessage(err, "Failed to create coupon");
      setCreateError(message);
      toast.error(message);
      throw err;
    }
  }

  const isFirstLoad = isCouponLoading && coupon.length === 0;
  const isLoadingMore = isCouponLoading && coupon.length !== 0 && !isSearching;
  const isBusy = isSearching || isFirstLoad;

  return (
    <div className="w-full">
      <CreatePanel
        variant="admin"
        open={createCoupon}
        onClose={() => setCreateCoupon(false)}
        title="Create coupon"
        fields={COUPON_FIELDS}
        validationSchema={couponSchema}
        onSubmit={handleCreateSubmit}
        error={createError}
      />
      <SearchBar
        colorVariants="admin"
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"categories"}
      />
      <Button
        className={"bg-[#5f0000] w-fit px-4 mb-8"}
        onClick={() => {
          setCreateError(null);
          setCreateCoupon(true);
        }}
      >
        <Plus /> Add Coupon
      </Button>
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
                  setCreateCoupon(false);
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
