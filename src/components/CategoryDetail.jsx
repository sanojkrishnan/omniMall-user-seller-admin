import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import P from "../components/ui/P";
import { Button } from "../components/ui/Button";
// TODO: confirm these two actions exist on your categorySlice / productSlice —
// named to match the pattern of fetchAllCategories in your Categories page.
import { ArrowLeft, Pencil, Trash2, ImageIcon, CircleDot } from "lucide-react";
import {
  deleteSingleCategory,
  singleCategoryFetch,
  updateCategory,
  clearCategoryUpdateError,
  clearCategoryDeleteError,
  clearCategoryState,
} from "../redux/slice/categorySlice";
import CartLoading from "./ui/CartLoading";
import ErrorFallback from "./ui/ErrorFallback";
import RelatedSuggestion from "./RelatedSuggestion";
import { EditPanel } from "./ui/EditPanel";
import { categorySchema } from "../validation/categorySchema";
import { toast } from "react-toastify";
import ConfirmProvider from "./ui/ConfirmProvider";
import { getErrorMessage } from "../utils/getErrorMessage";

//edit fields
const CATEGORY_EDIT_FIELDS = [
  { name: "name", label: "Category Name", type: "text", required: true },

  {
    name: "isActive",
    label: "Is Active",
    type: "toggle",
    required: true,
  },
  {
    name: "categoryImage",
    label: "Category Image",
    type: "image",
    imageType: "category",
    max: 2,
    required: true,
  },
];

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

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // TODO: adjust these selector keys to match your actual categorySlice shape.
  const {
    singleCategory,
    isCategoryLoading,
    categoryError,
    isCategoryUpdating,
    isCategoryDeleting,
    categoryUpdateError,
    categoryDeleteError,
    categoryDeleteMessage,
    categoryUpdateMessage,
  } = useSelector((state) => state.category);

  async function handleEditSubmit(values) {
    setIsSaving(true);
    try {
      await dispatch(
        updateCategory({ id: singleCategory._id, data: values }),
      ).unwrap();
      toast.success(categoryUpdateMessage || "update success");
      setEditOpen(false);
    } catch (err) {
      // .unwrap() throws action.payload directly (whatever extractError
      // returned in the thunk's rejectWithValue) — not an Error instance —
      // so err?.message was silently undefined whenever extractError
      // returns a plain string, and the toast always fell back to the
      // generic message instead of showing the real backend error.
      toast.error(getErrorMessage(err, "Failed to update coupon"));
    } finally {
      setIsSaving(false);
    }
  }

  console.log("Error in CategoryDetail.jsx:", categoryError);

  //edit submission
  const editableInitialValues = CATEGORY_EDIT_FIELDS.reduce((acc, field) => {
    acc[field.name] = singleCategory?.[field.name];
    return acc;
  }, {});

  // CategoryDetail.jsx
  async function handleDeleteResult(confirmed) {
    setConfirmDelete(false);
    if (!confirmed) return;

    try {
      await dispatch(deleteSingleCategory({ id: singleCategory._id })).unwrap();
      toast.success(categoryDeleteMessage || "Category deleted");
      dispatch(clearCategoryState());
      navigate(-1);
    } catch {
      // failure is already in the slice; the categoryDeleteError useEffect shows the toast
    }
  }

  useEffect(() => {
    const id = categoryId;
    dispatch(singleCategoryFetch({ id }));
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (!categoryDeleteError) return;
    toast.error(categoryDeleteError);
    dispatch(clearCategoryDeleteError());
  }, [categoryDeleteError, dispatch]);

  const showLoader =
    !categoryError && (isCategoryLoading || isCategoryDeleting);
  const showPage =
    singleCategory &&
    !isCategoryLoading &&
    !isCategoryDeleting &&
    !categoryError;

  return (
    <>
      {showLoader && (
        <div className="w-full h-[80vh] flex items-center justify-center">
          <CartLoading />
        </div>
      )}
      {showPage && (
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

          {/* Edit slide-over */}

          <EditPanel
            variant="admin"
            open={editOpen}
            onClose={() => {
              setEditOpen(false);
              dispatch(clearCategoryUpdateError());
            }}
            title="Edit category"
            fields={CATEGORY_EDIT_FIELDS}
            initialValues={editableInitialValues}
            validationSchema={categorySchema}
            onSubmit={handleEditSubmit}
            isSubmitting={isCategoryUpdating}
            error={categoryUpdateError}
          />

          <ConfirmProvider
            variant="admin"
            open={confirmDelete}
            onResult={handleDeleteResult}
            setOpen={setConfirmDelete}
          >
            {" "}
            Are you sure, you want to delete?
          </ConfirmProvider>
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
