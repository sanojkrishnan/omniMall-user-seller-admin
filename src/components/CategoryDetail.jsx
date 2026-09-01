import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import P from "../components/ui/P";
import { Button } from "../components/ui/Button";
// TODO: confirm these two actions exist on your categorySlice / productSlice —
// named to match the pattern of fetchAllCategories in your Categories page.
import { ArrowLeft, Pencil, Trash2, ImageIcon, CircleDot } from "lucide-react";
import { singleCategoryFetch } from "../redux/slice/categorySlice";
import CartLoading from "./ui/CartLoading";
import ErrorFallback from "./ui/ErrorFallback";
import ToggleSwitch from "./ui/ToggleSwitch";
import RelatedSuggestion from "./RelatedSuggestion";

const PRIMARY = "#60001A";
const PRIMARY_TINT = "#F8ECEE";
const BORDER = "#ECE0E3";
const BORDER_SOFT = "#F4EBED";
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

function CategoryDetail() {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO: adjust these selector keys to match your actual categorySlice shape.
  const { singleCategory, isCategoryLoading, categoryError } = useSelector(
    (state) => state.category,
  );

  console.log("Error in CategoryDetail.jsx:", categoryError);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const id = categoryId;
    dispatch(singleCategoryFetch({ id }));
  }, [categoryId, dispatch]);

  //counts from the products currently loaded for this category
  // const stats = useMemo(() => {
  //   const list = products || [];
  //   const active = list.filter((p) => p.isActive).length;
  //   const outOfStock = list.filter((p) => Number(p.stock) === 0).length;
  //   return { total: list.length, active, outOfStock };
  // }, [products]);

  // const columns = [
  //   {
  //     header: "Product Image",
  //     render: (item) =>
  //       item.productImage?.url ? (
  //         <img
  //           src={item.productImage.url}
  //           alt={item.name}
  //           className="w-12 h-12 rounded-md object-cover"
  //         />
  //       ) : (
  //         <div
  //           className="flex h-10 w-10 items-center justify-center rounded-md"
  //           style={{ background: PRIMARY_TINT, color: PRIMARY }}
  //         >
  //           <ImageIcon size={16} />
  //         </div>
  //       ),
  //   },
  //   {
  //     header: "Product Name",
  //     render: (item) => (
  //       <div className="font-medium" style={{ color: INK }}>
  //         {item.name || "N/A"}
  //       </div>
  //     ),
  //   },
  //   {
  //     header: "Price",
  //     render: (item) => (
  //       <span className="text-sm tabular-nums" style={{ color: INK }}>
  //         {item.price != null ? `₹${item.price}` : "N/A"}
  //       </span>
  //     ),
  //   },
  //   {
  //     header: "Stock",
  //     render: (item) => (
  //       <span
  //         className="text-sm tabular-nums"
  //         style={{ color: Number(item.stock) === 0 ? PRIMARY : INK_SOFT }}
  //       >
  //         {item.stock ?? "N/A"}
  //       </span>
  //     ),
  //   },
  //   {
  //     header: "Status",
  //     render: (item) => <StatusPill active={!!item.isActive} />,
  //   },
  // ];
  return (
    <>
      {isCategoryLoading && !singleCategory && !categoryError && (
        <div className="w-full h-[65vh] flex items-center justify-center">
          <CartLoading />
        </div>
      )}
      {!isCategoryLoading && singleCategory && !categoryError && (
        <div className="w-full">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#5f0000] mb-4 transition-colors"
          >
            <ArrowLeft size={15} />
            All categories
          </button>
          {/* Category header card */}
          <div
            className="flex items-start justify-between gap-4 rounded-xl p-5 bg-white mb-5"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-start gap-4 min-w-0">
              {singleCategory?.categoryImage?.url ? (
                <img
                  src={singleCategory.categoryImage.url}
                  alt={singleCategory?.name}
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
                <div className="flex items-center mb-4 gap-2 flex-wrap">
                  <h1
                    className="text-[22px] font-semibold"
                    style={{ color: INK }}
                  >
                    {singleCategory?.name || "Category"}
                  </h1>
                  <StatusPill active={!!singleCategory?.isActive} />
                </div>
                <ToggleSwitch className={"m-4"} />
                <div className="flex items-center gap-4 mt-2 text-black/50">
                  <P className="text-xs">
                    Created &nbsp;&nbsp;
                    {singleCategory?.createdAt
                      ? new Date(singleCategory.createdAt).toLocaleDateString()
                      : "N/A"}
                  </P>
                  &nbsp;&nbsp;
                  <P className="text-xs">
                    Updated &nbsp;&nbsp;
                    {singleCategory?.updatedAt &&
                    singleCategory?.createdAt &&
                    new Date(singleCategory.updatedAt).toLocaleDateString() !==
                      new Date(singleCategory.createdAt).toLocaleDateString()
                      ? new Date(singleCategory.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </P>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                className={
                  "w-fit px-3.5 bg-transparent border flex items-center gap-1.5"
                }
                style={{ color: INK_SOFT, background: BORDER_SOFT }}
                onClick={() => setEditOpen(true)}
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button
                className={
                  "w-fit px-3.5 bg-transparent border flex items-center gap-1.5"
                }
                style={{ color: PRIMARY, background: PRIMARY_TINT }}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </div>

          {/* Stats for this category
          <div className="flex gap-3 mb-5">
            <StatCard
              label="Loaded products"
              value={stats.total}
              icon={Layers}
            />
            <StatCard label="Active" value={stats.active} icon={CircleDot} />
            <StatCard
              label="Out of stock"
              value={stats.outOfStock}
              icon={Package}
            />
          </div> */}

          {/* Products in this category */}
          {/* <div className="flex items-center justify-start gap-3 mb-1">
            <h2 className="text-base font-semibold" style={{ color: INK }}>
              Products in this category
            </h2>
            <Button
              className={"bg-[#60001A] w-fit px-4 flex items-center gap-1.5"}
              onClick={() =>
                navigate(`/admin/products/new?category=${categoryId}`)
              }
            >
              <Plus size={16} /> Add
            </Button>
          </div> */}

          {/* <SearchBar
        colorVariants="admin"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"products"}
      /> */}

          {/* <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
            <DataTable
              title={`Products${singleCategory?.name || ""}`}
              columns={columns}
              data={products}
              onRowClick={(item) => navigate(`/admin/products/${item._id}`)}
              footer={<div id={triggerId} className="h-10" />}
            />
          </div> */}

          {/* Edit slide-over
      {editOpen && (
        <EditCategoryPanel
          category={cat}
          onClose={() => setEditOpen(false)}
          onSave={(data) => {
            // TODO: dispatch(updateCategory({ id, ...data }))
            setEditOpen(false);
          }}
        />
      )} */}
        </div>
      )}
      <div className="w-full h-[65vh] flex items-center justify-center">
        <ErrorFallback
          error={categoryError}
          loading={isCategoryLoading}
          message={categoryError}
        />
      </div>
    </>
  );
}

export default CategoryDetail;
