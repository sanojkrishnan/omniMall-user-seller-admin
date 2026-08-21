import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "../../components/ui/SearchBar";
import DataTable from "../../components/ui/DataTable";
import P from "../../components/ui/P";
import { Button } from "../../components/ui/Button";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
// TODO: confirm these two actions exist on your categorySlice / productSlice —
// named to match the pattern of fetchAllCategories in your Categories page.
import { fetchCategoryById } from "../../redux/slice/categorySlice";
import { fetchAllProducts } from "../../redux/slice/productSlice";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  X,
  ImageIcon,
  Package,
  CircleDot,
  TriangleAlert,
  Layers,
  Plus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Brand tokens — same palette as Categories.jsx, kept identical on purpose
// so the list page and detail page read as one product.
// ---------------------------------------------------------------------------
const PRIMARY = "#60001A";
const PRIMARY_TINT = "#F8ECEE";
const BORDER = "#ECE0E3";
const BORDER_SOFT = "#F4EBED";
const MUTED = "#96828A";
const INK = "#241318";
const INK_SOFT = "#5B4650";
const SUCCESS = "#2E7D4F";
const SUCCESS_BG = "#E9F5EE";
const OFF_BG = "#F6F1F2";
const OFF_TEXT = "#8A7278";

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
        <P className="text-[11px] uppercase tracking-wide font-medium" style={{ color: MUTED }}>
          {label}
        </P>
        <div className="text-xl font-semibold tabular-nums" style={{ color: INK }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0"
      style={{ background: checked ? PRIMARY : "#DCD1D4" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
        style={{ transform: checked ? "translateX(19px)" : "translateX(3px)" }}
      />
    </button>
  );
}

function CategoryDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO: adjust these selector keys to match your actual categorySlice shape.
  const {
    selectedCategory: cat,
    isSingleCategoryLoading: isCatLoading,
    categoryError,
  } = useSelector((state) => state.category);

  // TODO: adjust these selector keys to match your actual productSlice shape.
  const { products, isProductLoading, hasNextPage } = useSelector(
    (state) => state.product,
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoryById({ id }));
  }, [id]);

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        pagination: { page, limit: 15, search, category: id },
      }),
    );
  }, [page, search, id]);

  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: isProductLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  useSearchDebounce({
    setSearch,
    setPage,
    searchInput,
    setIsSearching,
    isLoading: isProductLoading,
  });

  // counts from the products currently loaded for this category
  const stats = useMemo(() => {
    const list = products || [];
    const active = list.filter((p) => p.isActive).length;
    const outOfStock = list.filter((p) => Number(p.stock) === 0).length;
    return { total: list.length, active, outOfStock };
  }, [products]);

  const columns = [
    {
      header: "Product Image",
      render: (item) =>
        item.productImage?.url ? (
          <img
            src={item.productImage.url}
            alt={item.name}
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
      header: "Product Name",
      render: (item) => (
        <div className="font-medium" style={{ color: INK }}>
          {item.name || "N/A"}
        </div>
      ),
    },
    {
      header: "Price",
      render: (item) => (
        <span className="text-sm tabular-nums" style={{ color: INK }}>
          {item.price != null ? `₹${item.price}` : "N/A"}
        </span>
      ),
    },
    {
      header: "Stock",
      render: (item) => (
        <span
          className="text-sm tabular-nums"
          style={{ color: Number(item.stock) === 0 ? PRIMARY : INK_SOFT }}
        >
          {item.stock ?? "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (item) => <StatusPill active={!!item.isActive} />,
    },
  ];

  if (isCatLoading && !cat) {
    return (
      <div className="w-full py-16 text-center">
        <P className="text-sm" style={{ color: MUTED }}>
          Loading category…
        </P>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className="w-full py-16 text-center">
        <TriangleAlert className="mx-auto mb-2" style={{ color: PRIMARY }} />
        <P className="text-sm" style={{ color: INK_SOFT }}>
          {categoryError}
        </P>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Back link */}
      <button
        onClick={() => navigate("/admin/categories")}
        className="flex items-center gap-1.5 text-sm font-medium mb-4"
        style={{ color: INK_SOFT }}
      >
        <ArrowLeft size={15} />
        Categories
      </button>

      {/* Category header card */}
      <div
        className="flex items-start justify-between gap-4 rounded-xl p-5 bg-white mb-5"
        style={{ border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-start gap-4 min-w-0">
          {cat?.categoryImage?.url ? (
            <img
              src={cat.categoryImage.url}
              alt={cat?.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-xl shrink-0"
              style={{ background: PRIMARY_TINT, color: PRIMARY }}
            >
              <ImageIcon size={26} />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] font-semibold" style={{ color: INK }}>
                {cat?.name || "Category"}
              </h1>
              <StatusPill active={!!cat?.isActive} />
            </div>
            <P className="text-xs mt-1" style={{ color: MUTED, fontFamily: "monospace" }}>
              /{cat?.slug || "—"}
            </P>
            <div className="flex items-center gap-4 mt-2">
              <P className="text-xs" style={{ color: INK_SOFT }}>
                Created{" "}
                {cat?.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "N/A"}
              </P>
              <P className="text-xs" style={{ color: INK_SOFT }}>
                Updated{" "}
                {cat?.updatedAt ? new Date(cat.updatedAt).toLocaleDateString() : "N/A"}
              </P>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            className={"w-fit px-3.5 bg-transparent border flex items-center gap-1.5"}
            style={{ color: INK_SOFT, background: BORDER_SOFT }}
            onClick={() => setEditOpen(true)}
          >
            <Pencil size={14} /> Edit
          </Button>
          <Button
            className={"w-fit px-3.5 bg-transparent border flex items-center gap-1.5"}
            style={{ color: PRIMARY, background: PRIMARY_TINT }}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>

      {/* Stats for this category */}
      <div className="flex gap-3 mb-5">
        <StatCard label="Loaded products" value={stats.total} icon={Layers} />
        <StatCard label="Active" value={stats.active} icon={CircleDot} />
        <StatCard label="Out of stock" value={stats.outOfStock} icon={Package} />
      </div>

      {/* Products in this category */}
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="text-base font-semibold" style={{ color: INK }}>
          Products in this category
        </h2>
        <Button
          className={"bg-[#60001A] w-fit px-4 flex items-center gap-1.5"}
          onClick={() => navigate(`/admin/products/new?category=${id}`)}
        >
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <SearchBar
        colorVariants="admin"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"products"}
      />

      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
        <DataTable
          title={`Products · ${cat?.name || ""}`}
          columns={columns}
          data={products}
          onRowClick={(item) => navigate(`/admin/products/${item._id}`)}
          footer={<div id={triggerId} className="h-10" />}
        />
      </div>

      {/* Edit slide-over */}
      {editOpen && (
        <EditCategoryPanel
          category={cat}
          onClose={() => setEditOpen(false)}
          onSave={(data) => {
            // TODO: dispatch(updateCategory({ id, ...data }))
            setEditOpen(false);
          }}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(36,19,24,0.35)" }}
        >
          <div className="w-full max-w-sm rounded-xl p-5 bg-white">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg mb-3"
              style={{ background: PRIMARY_TINT, color: PRIMARY }}
            >
              <Trash2 size={18} />
            </div>
            <h3 className="text-base font-semibold mb-1" style={{ color: INK }}>
              Delete "{cat?.name}"?
            </h3>
            <P className="text-sm mb-4" style={{ color: INK_SOFT }}>
              This can't be undone. Products in this category will need to be reassigned.
            </P>
            <div className="flex justify-end gap-2">
              <Button
                className={"w-fit px-3.5 bg-transparent border"}
                style={{ color: INK_SOFT, background: BORDER_SOFT }}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                className={"bg-[#60001A] w-fit px-3.5"}
                onClick={() => {
                  // TODO: dispatch(deleteCategory({ id })).then(() => navigate("/admin/categories"))
                  setConfirmDelete(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit slide-over — same shape as the one on the list page, pre-filled
// ---------------------------------------------------------------------------
function EditCategoryPanel({ category, onClose, onSave }) {
  const [name, setName] = useState(category?.name || "");
  const [active, setActive] = useState(!!category?.isActive);
  const [image, setImage] = useState(category?.categoryImage?.url || null);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(36,19,24,0.35)" }}>
      <div className="h-full w-full max-w-sm bg-white flex flex-col" style={{ borderLeft: `1px solid ${BORDER}` }}>
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <h2 className="text-lg font-semibold" style={{ color: INK }}>
            Edit category
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ color: INK_SOFT }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div>
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImage(URL.createObjectURL(file));
                }}
              />
              {image ? (
                <img src={image} alt="" className="mx-auto h-24 w-24 rounded-xl object-cover mb-2" />
              ) : (
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-xl mb-2"
                  style={{ background: PRIMARY_TINT, border: `1px dashed ${PRIMARY}55` }}
                >
                  <ImageIcon size={22} style={{ color: PRIMARY }} />
                </div>
              )}
            </label>
            <P className="text-center text-xs" style={{ color: MUTED }}>
              Upload a category thumbnail (1:1, min 400×400)
            </P>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: INK_SOFT }}>
              Category name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ border: `1px solid ${BORDER}`, color: INK }}
            />
          </div>

          <div
            className="flex items-center justify-between rounded-lg px-3.5 py-3"
            style={{ background: BORDER_SOFT }}
          >
            <div>
              <div className="text-sm font-medium" style={{ color: INK }}>
                Visible on storefront
              </div>
              <P className="text-xs mt-0.5" style={{ color: MUTED }}>
                Inactive categories are hidden from customers.
              </P>
            </div>
            <Toggle checked={active} onChange={() => setActive((a) => !a)} />
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <Button
            className={"flex-1 bg-transparent"}
            style={{ color: INK_SOFT, background: BORDER_SOFT }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={"flex-1 bg-[#60001A]"}
            disabled={!name.trim()}
            onClick={() => onSave({ name: name.trim(), isActive: active, image })}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CategoryDetail;