import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/ui/DataTable";
import { useEffect, useMemo, useState } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScrolling";
import { fetchAllCategories } from "../../redux/slice/categorySlice";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import { Plus, ImageIcon, Layers, Package, CircleDot } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";
import { StatCard } from "../../components/ui/StatCard";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import SearchNotFound from "../../components/ui/SearchNotFound";
import Loading from "../../components/ui/Loading";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Brand tokens — same palette as the app's existing bg-[#5f0000] usage,
// just centralised so every shade of the accent stays in one place.
// Swap PRIMARY to your exact brand hex if #60001A / #5f0000 should differ.
// ---------------------------------------------------------------------------
const PRIMARY = "#60001A";
const PRIMARY_TINT = "#F8ECEE";
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
    type: "image",
    required: true,
  },
  {
    name: "isActive",
    label: "Active",
    type: "checkbox",
    required: true,
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

function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category, isCategoryLoading, categoryError, hasNextPage } =
    useSelector((state) => state.category);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw input value
  const [isSearching, setIsSearching] = useState(false); // searching loading
  const [createCategory, setCreateCategory] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // category fetch
  useEffect(() => {
    dispatch(
      fetchAllCategories({
        pagination: {
          page,
          limit: 15,
          search,
        },
      }),
    );
  }, [page, search, dispatch]);

  //click navigation
  useEffect(() => {
    if (openCategory && selectedCategoryId) {
      navigate(`/admin/categories/${selectedCategoryId}`);
    }
  }, [openCategory, selectedCategoryId, navigate]);

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
      render: (item) => <StatusPill active={item.isActive} />,
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

  const isFirstLoad = isCategoryLoading && category.length === 0;
  const isLoadingMore =
    isCategoryLoading && category.length !== 0 && !isSearching;
  const isBusy = isSearching || isFirstLoad;

  return (
    <div className="w-full">
      {/* Stats */}
      <div className="flex gap-3 mb-5">
        <StatCard label="Loaded categories" value={stats.total} icon={Layers} />
        <StatCard label="Active" value={stats.active} icon={CircleDot} />
        <StatCard label="Inactive" value={stats.inactive} icon={Package} />
      </div>

      {/* <SearchBar
        colorVariants="admin"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"none"}
      /> */}
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

      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] justify-between">
        <div className="w-full flex-1 overflow-y-auto px-4 pb-4 custom-scrollBar">
          {isBusy && !categoryError && (
            <div className="w-full h-[65vh] flex items-center justify-center">
              <CartLoading />
            </div>
          )}

          {!isBusy && !categoryError && category.length !== 0 && (
            <>
              <DataTable
                title="All Coupons"
                columns={columns}
                data={category}
                onRowClick={(item) => {
                  setSelectedCategoryId(item._id);
                  setOpenCategory(true);
                  setCreateCategory(false);
                }}
                footer={<div id={triggerId} className="h-5" />}
              />
            </>
          )}
          <ErrorFallback loading={isBusy} error={categoryError} />

          {/* no results */}
          {!isBusy && !categoryError && category.length === 0 && (
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
