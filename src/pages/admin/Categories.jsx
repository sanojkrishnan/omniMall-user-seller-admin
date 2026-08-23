import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/ui/SearchBar";
import DataTable from "../../components/ui/DataTable";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";
import { fetchAllCategories } from "../../redux/slice/categorySlice";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import P from "../../components/ui/P";
import {
  Plus,
  TriangleAlert,
  ImageIcon,
  Layers,
  Package,
  CircleDot,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import { toast } from "react-toastify";

// ---------------------------------------------------------------------------
// Brand tokens — same palette as the app's existing bg-[#5f0000] usage,
// just centralised so every shade of the accent stays in one place.
// Swap PRIMARY to your exact brand hex if #60001A / #5f0000 should differ.
// ---------------------------------------------------------------------------
const PRIMARY = "#60001A";
const PRIMARY_TINT = "#F8ECEE";
const BORDER = "#ECE0E3";
const MUTED = "#96828A";
const INK_SOFT = "#5B4650";
const SUCCESS = "#2E7D4F";
const SUCCESS_BG = "#E9F5EE";
const OFF_BG = "#F6F1F2";
const OFF_TEXT = "#8A7278";

const CATEGORY_FIELDS = [
  { name: "name", label: "Category Name", type: "text", required: true },

  {
    name: "categoryImage",
    label: "Category Image",
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

function StatusPill({ active }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium w-fit"
      style={{
        background: active ? SUCCESS_BG : OFF_BG,
        color: active ? SUCCESS : OFF_TEXT,
      }}
    >
      <CircleDot size={11} strokeWidth={3} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div
      className="flex-1 rounded-xl p-4 flex items-center gap-3 bg-white"
      style={{ border: `1px solid ${BORDER}` }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
        style={{ background: PRIMARY_TINT, color: PRIMARY }}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <P
          className="text-[11px] uppercase tracking-wide font-medium"
          style={{ color: MUTED }}
        >
          {label}
        </P>
        <div
          className="text-xl font-semibold tabular-nums"
          style={{ color: "#241318" }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function Categories() {
  const dispatch = useDispatch();
  const { category, isCategoryLoading, categoryError, hasNextPage } =
    useSelector((state) => state.category);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw input value
  const [isSearching, setIsSearching] = useState(false); // searching loading
  const [createCategory, setCreateCategory] = useState(false);
  const [filterValues, setFilterValues] = useState({
    category: "",
    priceSort: "",
    sort: "",
  });

  //toggle switch
  async function handleSwitchChange(status) {
    // setIsTogglingStatus(true);
    // try {
    //   await dispatch(
    //     changeCouponStatus({
    //       id: singleCoupon._id,
    //       status: status ? "active" : "inactive",
    //     }),
    //   ).unwrap();
    //   toast.success(status ? "Coupon activated" : "Coupon deactivated");
    // } catch (err) {
    //   // Same .unwrap() gotcha as handleEditSubmit below — the thrown value
    //   // is action.payload directly, not an Error, so err?.message alone
    //   // silently produced the generic fallback every time.
    //   toast.error(getErrorMessage(err, "Failed to update coupon status"));
    // } finally {
    //   setIsTogglingStatus(false);
    // }
  }

  // category fetch
  useEffect(() => {
    dispatch(
      fetchAllCategories({
        pagination: {
          page,
          limit: 15,
          search,
          category: filterValues.category,
          sort: filterValues.sort,
        },
      }),
    );
  }, [page, search, filterValues.category, filterValues.sort]);

  // quick counts from the categories currently loaded in the store.
  // if you need true totals (not just what's loaded on this page), read
  // them off a dedicated stats endpoint instead — this is a lightweight
  // stand-in so the header isn't empty.
  const stats = useMemo(() => {
    const list = category || [];
    const active = list.filter((c) => c.isActive).length;
    return {
      total: list.length,
      active,
      inactive: list.length - active,
    };
  }, [category]);

  const columns = [
    {
      header: "Category Image",
      render: (item) =>
        item.categoryImage?.url ? (
          <img
            src={item.categoryImage.url}
            alt={item.categoryName}
            className="w-12 h-12 rounded-md object-cover"
          />
        ) : (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-md"
            style={{ background: PRIMARY_TINT, color: PRIMARY }}
          >
            <ImageIcon size={16} />
          </div>
        ),
    },
    {
      header: "Category Name",
      render: (item) => (
        <div className="font-medium" style={{ color: "#241318" }}>
          {item.name || "N/A"}
        </div>
      ),
    },
    {
      header: "Status",
      // NOTE: swap `item.isActive` for whatever field your API actually
      // returns for status — placeholder mapping kept from the original.
      render: (item) => <StatusPill active={!!item.isActive} />,
    },
    {
      header: "Created At",
      render: (item) =>
        item.createdAt && (
          <span className="text-sm" style={{ color: INK_SOFT }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        ),
    },
    {
      header: "Modified At",
      render: (item) => (
        <span className="text-sm" style={{ color: MUTED }}>
          {item.updatedAt &&
          new Date(item.updatedAt).toLocaleDateString() ===
            new Date(item.createdAt).toLocaleDateString()
            ? "N/A"
            : new Date(item.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Action",
      render: (item) => (
        <ToggleSwitch
          checked={item.status === "active"}
          onChange={handleSwitchChange}
        />
      ),
    },
  ];

  // infinite scrolling
  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: isCategoryLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  useSearchDebounce({
    setSearch,
    setPage,
    searchInput,
    setIsSearching,
    isLoading: isCategoryLoading,
  });

  return (
    <div className="w-full">
      {/* Stats */}
      <div className="flex gap-3 mb-5">
        <StatCard label="Loaded categories" value={stats.total} icon={Layers} />
        <StatCard label="Active" value={stats.active} icon={CircleDot} />
        <StatCard label="Inactive" value={stats.inactive} icon={Package} />
      </div>

      <SearchBar
        colorVariants="admin"
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"none"}
      />
      <div className="flex items-start justify-between gap-4 mb-5">
        <Button
          className={"bg-[#60001A] w-fit px-4 flex items-center gap-1.5"}
          onClick={() => {
            // setActiveCategory(null);
            // setPanelMode("add");
          }}
        >
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {categoryError && (
        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 mt-3 text-sm"
          style={{ background: PRIMARY_TINT, color: PRIMARY }}
        >
          <TriangleAlert size={16} />
          {categoryError}
        </div>
      )}

      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
        <DataTable
          title="All Categories"
          columns={columns}
          data={category}
          onRowClick={(item) => {
            // setActiveCategory(item);
            // setPanelMode("edit");
          }}
          footer={<div id={triggerId} className="h-10" />}
        />
      </div>

      {/* Add */}
      {/* <CreatePanel
        variant="admin"
         open={createCategory}
        onClose={() => setCreateCategory(false)}
         title="Create category"
         fields={CATEGORY_FIELDS}
         validationSchema={categorySchema}
         onSubmit={handleCreateSubmit}
      /> */}
    </div>
  );
}

export default Categories;
