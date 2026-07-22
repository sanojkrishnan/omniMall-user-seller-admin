import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { useCurrency } from "../hooks/useCurrency";
import { useDateFormatter } from "../hooks/useDateFormatter";
import { AdminStockBar, FieldRow, SectionLabel } from "./AdminProductSupport";
import ConfirmProvider from "./ui/ConfirmProvider";
import {
  clearProductError,
  clearProductState,
  deleteSingleProduct,
  singleProductFetch,
} from "../redux/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearCategoryError,
  clearCategoryState,
  singleCategoryFetch,
} from "../redux/slice/categorySlice";
import {
  clearCouponError,
  clearCouponState,
  fetchCouponById,
} from "../redux/slice/couponSlice";
import {
  clearSellerError,
  clearSellerState,
  singleSellerFetch,
} from "../redux/slice/sellerSlice";
import CartLoading from "./ui/CartLoading";
import ErrorFallback from "./ui/ErrorFallback";
import { toast } from "react-toastify";

export default function ProductAdminView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  //product fetch
  const { singleProduct, isProductLoading, productError } = useSelector(
    (state) => state.product,
  );
  //coupon fetch
  const { singleCoupon, isCouponLoading, couponError } = useSelector(
    (state) => state.coupon,
  );
  //single category fetch
  const { singleCategory, isCategoryLoading, categoryError } = useSelector(
    (state) => state.category,
  );
  //single seller fetch
  const { singleSeller, isSellerLoading, sellerError } = useSelector(
    (state) => state.seller,
  );

  useEffect(() => {
    if (productId) {
      dispatch(singleProductFetch({ id: productId }));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (productError) {
      toast.error(productError);
      dispatch(clearProductError());
    }
  });

  useEffect(() => {
    if (!singleProduct?._id) return;

    dispatch(singleCategoryFetch({ id: singleProduct.categoryId }));
    dispatch(singleSellerFetch({ id: singleProduct.sellerId }));

    if (singleProduct.couponId) {
      dispatch(fetchCouponById({ id: singleProduct.couponId }));
    }
  }, [singleProduct, dispatch]);

  const [tab, setTab] = useState("overview");
  const [activeImg, setActiveImg] = useState(0);
  const [open, setOpen] = useState(false);

  function handleResult(confirmed) {
    setOpen(false);
    if (confirmed) {
      dispatch(deleteSingleProduct({ id: singleProduct._id }));
      clearProductState();
      toast.success("Product deleted successfully");
      navigate("/admin/products");
    }
  }
  const currency = useCurrency(); //digit to currency
  const formatDate = useDateFormatter(); // formats dates into readable date values

  const inStock = singleProduct?.stock > 0;
  const savings = singleProduct?.mrp - singleProduct?.offerPrice;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing & stock" },
    { id: "seller", label: "Seller & category" },
    { id: "record", label: "Record" },
  ];

  const isBusy =
    isProductLoading || isCategoryLoading || isCouponLoading || isSellerLoading;

  const productReady = Boolean(singleProduct?._id);
  const categoryReady = Boolean(singleCategory?._id);
  const sellerReady = Boolean(singleSeller?._id);
  const couponReady = !singleProduct?.couponId || Boolean(singleCoupon?._id);
  const imagesReady = (singleProduct?.productImage?.length ?? 0) > 0;

  const onLaunch =
    productReady && categoryReady && sellerReady && couponReady && imagesReady;

  const isError = couponError || sellerError || categoryError || productError;

  if (isError) {
    return <ErrorFallback loading={isBusy} error={isError} />;
  }

  if (isBusy || !onLaunch) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CartLoading />
      </div>
    );
  }

  return (
    <div className="font-sans text-[#241a1a] min-h-screen">
      <ConfirmProvider variant="admin" open={open} onResult={handleResult}>
        Are you sure, you want to delete?
      </ConfirmProvider>

      <style>{`
        * { box-sizing: border-box; }
        table { border-collapse: collapse; width: 100%; }
        .row-hover:hover { background: #faf7f6; }
      `}</style>

      <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div className="text-[13px] text-[#8a7873] flex items-center gap-1.5">
          <span>Products</span>
          <span className="opacity-50">/</span>
          <span>{singleCategory.name}</span>
          <span className="opacity-50">/</span>
          <span className="text-[#241a1a] font-medium">
            {singleProduct.productName}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className=" border-[#e8e1df] text-[#241a1a]"
          >
            Duplicate
          </Button>
          <Button
            variant="secondary"
            className="border-[#e8e1df] text-[#a97327] "
          >
            Flag for review
          </Button>
          <Button
            variant="secondary"
            className="border-[#e8e1df] text-[#5f0000] "
          >
            Suspend listing
          </Button>

          <Button
            onClick={() => setOpen(true)}
            className="relative border border-[#5f0000] bg-[#5f0000] text-white rounded-md px-4 py-2 text-[13px] font-semibold cursor-pointer"
          >
            Delete product
          </Button>
        </div>
      </div>

      <div className="flex border border-[#e8e1df] rounded-xl overflow-hidden">
        <div className="w-[5px] bg-[#5f0000] shrink-0" />

        <div className="flex flex-1 min-w-0">
          <div className="w-[36%] p-7 border-r border-[#e8e1df]">
            <div className="aspect-square rounded-[10px] overflow-hidden bg-[#faf7f6] border border-[#e8e1df]">
              <img
                src={singleProduct.productImage[activeImg].url}
                alt={singleProduct.productName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2 mt-2.5">
              {singleProduct.productImage.map((img, i) => (
                <Button
                  key={img.publicId}
                  onClick={() =>
                    singleProduct.productImage.length >= i
                      ? setActiveImg(i)
                      : null
                  }
                  className={`w-[52px] h-[52px] rounded-md overflow-hidden p-0 bg-transparent cursor-pointer ${
                    i === activeImg
                      ? "border-2 border-[#5f0000]"
                      : "border border-[#e8e1df]"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>

            <div className="text-[11px] text-[#8a7873] mt-2 font-mono">
              {singleProduct.productImage.length} images &middot;{" "}
              {singleProduct.productImage[activeImg].publicId}
            </div>

            <div className="mt-6">
              <SectionLabel>Attributes</SectionLabel>
              <div className="flex justify-between py-[7px] text-[13px]">
                <span className="text-[#8a7873]">Brand</span>
                <span className="font-medium">{singleProduct.brand}</span>
              </div>
              <div className="flex justify-between py-[7px] text-[13px]">
                <span className="text-[#8a7873]">Category</span>
                <span className="font-medium">{singleCategory.name}</span>
              </div>
              <div className="flex justify-between py-[7px] text-[13px]">
                <span className="text-[#8a7873]">Coupon</span>
                <span className="font-medium">
                  {singleProduct.couponId
                    ? singleProduct.couponId
                    : "None applied"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-7 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="font-sans font-semibold text-[26px] m-0 text-[#241a1a]">
                  {singleProduct.productName}
                </h1>
                <div className="font-mono text-xs text-[#8a7873] mt-1.5">
                  {singleProduct.id}
                </div>
              </div>

              <div
                className={`w-[68px] h-[68px] rounded-full border-2 flex items-center justify-center -rotate-6 shrink-0 ${
                  inStock ? "border-[#5f0000]" : "border-[#8a7873]"
                }`}
              >
                <span
                  className={`font-mono text-[11px] font-semibold tracking-[0.04em] uppercase ${
                    inStock ? "text-[#5f0000]" : "text-[#8a7873]"
                  }`}
                >
                  {inStock ? "In stock" : "Sold out"}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-2.5 mt-[18px]">
              <span className="font-mono text-2xl font-medium">
                {currency(singleProduct.offerPrice)}
              </span>
              <span className="font-mono text-sm text-[#8a7873] line-through">
                {currency(singleProduct.mrp)}
              </span>
              <span className="text-xs text-[#3f6b52] bg-[#eef4f0] px-2 py-[3px] rounded">
                {singleProduct.offerPercentage}% off
              </span>
            </div>

            <div className="flex justify-between gap-1 mt-[26px] border-b pb-1 border-[#e8e1df] flex-wrap">
              {tabs.map((t) => (
                <Button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  variant={"secondary"}
                  className={` border-0 w-fit shadow-none text-[13px] font-medium -mb-px cursor-pointer ${
                    tab === t.id
                      ? "text-[#5f0000] border-b-2 border-[#5f0000]"
                      : "text-[#8a7873] border-b-2 border-transparent"
                  }`}
                >
                  {t.label}
                </Button>
              ))}
            </div>

            <div className="pt-[22px]">
              {tab === "overview" && (
                <div>
                  <SectionLabel>Description</SectionLabel>
                  <p className="text-sm leading-[1.65] text-[#241a1a] mt-0 mb-[22px]">
                    {singleProduct.productDesc}
                  </p>
                  <SectionLabel>Snapshot</SectionLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["In stock", singleProduct.stock],
                      ["Units ordered", singleProduct.ordered],
                      ["You save", currency(savings)],
                    ].map(([label, val]) => (
                      <div
                        key={label}
                        className="bg-[#faf7f6] rounded-lg px-4 py-3.5"
                      >
                        <div className="text-xs text-[#8a7873]">{label}</div>
                        <div className="font-mono text-xl font-medium mt-1">
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "pricing" && (
                <div>
                  <SectionLabel>Pricing</SectionLabel>
                  <table>
                    <tbody>
                      <tr className="border-t border-[#e8e1df] row-hover">
                        <td className="py-2.5 px-2 text-[13px] text-[#8a7873]">
                          MRP
                        </td>
                        <td className="py-2.5 px-2 text-[13px] font-mono text-right">
                          {currency(singleProduct.mrp)}
                        </td>
                      </tr>
                      <tr className="border-t border-[#e8e1df] row-hover">
                        <td className="py-2.5 px-2 text-[13px] text-[#8a7873]">
                          Offer price
                        </td>
                        <td className="py-2.5 px-2 text-[13px] font-mono text-right font-medium">
                          {currency(singleProduct.offerPrice)}
                        </td>
                      </tr>
                      <tr className="border-t border-[#e8e1df] row-hover">
                        <td className="py-2.5 px-2 text-[13px] text-[#8a7873]">
                          Discount
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className="text-xs font-medium px-2 py-[3px] rounded bg-[#eef4f0] text-[#3f6b52]">
                            {singleProduct.offerPercentage}%
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-6">
                    <SectionLabel>Stock</SectionLabel>
                    <div className="flex items-center justify-between py-2.5 px-2">
                      <span className="text-[13px] text-[#8a7873]">
                        Available units
                      </span>
                      <AdminStockBar
                        stock={singleProduct.stock - singleProduct.ordered}
                        max={singleProduct.stock}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-2 border-t border-[#e8e1df]">
                      <span className="text-[13px] text-[#8a7873]">
                        Units ordered
                      </span>
                      <span className="font-mono text-[13px]">
                        {singleProduct.ordered}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {tab === "seller" && (
                <div>
                  <SectionLabel>Seller</SectionLabel>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-[#faf7f6] border border-[#e8e1df] flex items-center justify-center font-semibold text-sm text-[#5f0000]">
                      {singleSeller.firstName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {singleSeller.firstName + " " + singleSeller.lastName}
                      </div>
                      <div className="text-xs text-[#8a7873]">
                        Rating {singleSeller.rating ? singleSeller.rating : 0}{" "}
                        &middot;{" "}
                        {singleSeller.totalListings
                          ? singleSeller.totalListings
                          : 0}{" "}
                        listings
                      </div>
                    </div>
                  </div>
                  <FieldRow label="Seller ID" value={singleSeller._id} mono />
                  <FieldRow
                    label="Joined"
                    value={formatDate(singleSeller.createdAt)}
                  />

                  <div className="mt-6">
                    <SectionLabel>Category</SectionLabel>
                    <FieldRow label="Name" value={singleCategory.name} />
                    <FieldRow
                      label="Category ID"
                      value={singleCategory._id}
                      mono
                    />
                  </div>
                </div>
              )}

              {tab === "record" && (
                <div>
                  <SectionLabel>Database record</SectionLabel>
                  <FieldRow label="_id" value={singleProduct._id} mono />
                  <FieldRow
                    label="categoryId"
                    value={singleCategory._id}
                    mono
                  />
                  <FieldRow label="sellerId" value={singleCategory._id} mono />
                  <FieldRow
                    label="couponId"
                    value={
                      singleProduct.couponId === null
                        ? "null"
                        : singleProduct.couponId
                    }
                    mono
                  />
                  <FieldRow label="__v" value={singleProduct.__v} mono />
                  <FieldRow
                    label="createdAt"
                    value={formatDate(singleProduct.createdAt)}
                    mono
                  />
                  <FieldRow
                    label="updatedAt"
                    value={formatDate(singleProduct.updatedAt)}
                    mono
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
