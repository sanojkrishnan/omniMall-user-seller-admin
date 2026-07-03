import { Plus, Trash, TriangleAlert, X } from "lucide-react";
import { FormCard } from "./ui/FormCard";
import { Button } from "./ui/Button";
import OmniMall from "./ui/OmniMall";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAProduct, deleteSingleProduct } from "../redux/slice/productSlice";
import { toast } from "react-toastify";
import { Field, Form, Formik } from "formik";
import { productSchema } from "../validation/productSchema";
import { Link } from "react-router-dom";
import { handleImage } from "../utils/imageCompressor";
import SelectionButton from "./ui/SelectionButton";
import { fetchAllCategories } from "../redux/slice/categorySlice";
import { fetchAllSellers } from "../redux/slice/sellerSlice";
import Loading from "./ui/Loading";

const filter = ["seller", "seller", "seller", "seller"];

function ProductListTile(props) {
  const { setOpenProduct, product, addProduct, openProduct, setAddProduct } =
    props;
  const dispatch = useDispatch();
  const { isProductLoading } = useSelector((state) => state.product);

  const { category, isCategoryLoading, categoryError } = useSelector(
    (state) => state.category,
  );

  const { seller, isSellerLoading, sellerError } = useSelector(
    (state) => state.seller,
  );

  // Add this useEffect in ProductListTile
  useEffect(() => {
    if (openProduct || addProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openProduct, addProduct]);

  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({});
  const [currentImage, setCurrentImage] = useState(0);
  const [selectButtonLoading, setSelectButtonLoading] = useState(false);

  const divRef = useRef(null);
  const formikRef = useRef(null);

  const handleClose = () => {
    setOpenProduct(false);
    setAddProduct(false);
    setStep(0);
    setStepErrors({});
    formikRef.current?.resetForm();
  };

  useEffect(() => {
    if (isCategoryLoading || isSellerLoading) {
      setSelectButtonLoading(true);
    }
    if (!isCategoryLoading || !isSellerLoading) {
      setSelectButtonLoading(false);
    }
    if (categoryError) {
      console.log(categoryError);
    }
    if (sellerError) {
      console.log(sellerError);
    }
  }, [isCategoryLoading, isSellerLoading, categoryError, sellerError]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        if (openProduct) {
          setOpenProduct(false);
        } else if (addProduct) {
          handleClose();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openProduct, addProduct]);
  const handleDelete = async () => {
    if (!product._id) return toast.error("Product ID missing");

    const result = await dispatch(deleteSingleProduct({ id: product._id }));

    if (deleteSingleProduct.fulfilled.match(result)) {
      toast.success("Product deleted successfully");

      setOpenProduct(false);

      setAddProduct(false);
    } else {
      toast.error(result.payload || "Deletion failed");
    }
  };

  return (
    <FormCard ref={divRef}>
      {/* product showing  */}
      <div className="w-full flex products-start justify-end mb-1">
        <Button
          variant="secondary"
          className={"w-fit p-1 m-0 rounded-full"}
          onClick={() => {
            handleClose();
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
      {/* image carousel */}
      <div className="relative">
        <div
          className={`${openProduct ? "scale-100" : "scale-0"} absolute inset-0 duration-200 transition-all origin-center`}
        >
          <div className="relative w-full h-60 overflow-hidden rounded-lg">
            {/* Sliding track */}
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {product.productImage?.length > 0 ? (
                product.productImage?.map((img, index) => (
                  <div
                    key={index}
                    className="min-w-full h-full relative flex-shrink-0"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={img?.url}
                      alt={`${product.productName}-${index}`}
                    />
                  </div>
                ))
              ) : (
                <div className="min-w-full h-full relative flex-shrink-0 bg-gray-100 flex items-center justify-center flex-col">
                  <TriangleAlert className="size-12" /> <p>There is no image</p>
                </div>
              )}
            </div>

            {/* Prev / Next buttons */}
            {product.productImage?.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full z-10"
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === 0 ? product.productImage.length - 1 : prev - 1,
                    )
                  }
                >
                  ❮
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full z-10"
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === product.productImage.length - 1 ? 0 : prev + 1,
                    )
                  }
                >
                  ❯
                </button>
              </>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
              {product.productImage?.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  className={`rounded-full transition-all duration-300 ${
                    currentImage === index
                      ? "bg-white w-4 h-3" // active dot stretches wider
                      : "bg-white/50 w-3 h-3"
                  }`}
                />
              ))}
            </div>
          </div>{" "}
          <div className="p-6">
            <div>
              <div className="border-b py-2">
                <h1 className="mt-3 mb-2 text-2xl font-semibold tracking-tight text-heading">
                  {product.productName}
                </h1>
                <p>{product.productDesc}</p>
                <p>Current Stock: {product.stock}</p>
                <p>Rating: 15k</p>
                <h5>
                  MRP: <span>{product.mrp}$</span>
                </h5>
                <p>{product.offerPercentage}% Off</p>
                <h5 className="text-xl">Seller Price: {product.offerPrice}$</h5>
              </div>
              <div>
                <div>
                  Category: &nbsp;
                  {product.categoryData ? (
                    <Link
                      className="text-blue-500 hover:underline"
                      to={`/categories/${product.categoryData?._id}`}
                    >
                      {product.categoryData?.name}
                    </Link>
                  ) : (
                    "Unknown Category"
                  )}
                </div>
                <div>
                  Sold by: &nbsp;
                  {product.sellerData ? (
                    <Link
                      className="text-blue-500 hover:underline"
                      to={`/seller/${product.sellerData?._id}`}
                    >
                      {product.sellerData.firstName}{" "}
                      {product.sellerData.lastName}
                    </Link>
                  ) : (
                    "Unknown Seller"
                  )}
                </div>
                {product.sellerData?.profileImage?.url && (
                  <img
                    src={product.sellerData.profileImage.url}
                    alt="Seller"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
              <div className="pt-4">
                <Button
                  className={"bg-red-500"}
                  onClick={handleDelete}
                  disabled={isProductLoading}
                >
                  <Trash />
                  {isProductLoading ? "Removing..." : "Remove"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* add product section */}
        <div
          className={`${addProduct ? "scale-100" : "scale-0"} inset-0 duration-200 transition-all origin-center`}
        >
          <div className=" w-full flex justify-center items-center mb-2 mt-2">
            <div className="text-center">
              <OmniMall />
              <h3 className="text-center pt-2 font-bold text-[#5f0000]">
                Add Product
              </h3>
            </div>
          </div>
          {/* Step indicator */}
          <div className="relative mb-2">
            <div className="flex  items-center justify-center w-full">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-fit h-10 flex justify-center items-center"
                >
                  <div
                    className={` rounded-full flex items-center justify-center transition-all duration-500
          ${i < step ? "w-5 h-5 border-[#5f0000] bg-[#5f0000]" : i === step ? "w-5 h-5 border-4 animate-pulse border-[#5f0000]" : "w-0"}`}
                  >
                    {i < step && (
                      <svg
                        className="w-3 h-4 text-white animate-[drawTick_0.3s_ease-in-out]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {i < 3 && (
                    <div
                      className={` h-1 rounded-xl transition-all duration-500 ${
                        step > i ? "bg-[#5f0000] w-12 sm:w-24" : "w-0"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Formik
            innerRef={formikRef}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              productName: "",
              brand: "",
              productDesc: "",
              categoryId: "",
              sellerId: "",
              couponId: "",
              stock: "",
              mrp: "",
              offerPrice: "",
              productImage: [],
            }}
            validationSchema={productSchema}
            onSubmit={async (values) => {
              // Build FormData
              const formData = new FormData();
              formData.append("productName", values.productName);
              formData.append("brand", values.brand);
              formData.append("productDesc", values.productDesc);
              formData.append("categoryId", values.categoryId);
              formData.append("sellerId", values.sellerId);
              if (values.couponId) {
                formData.append("couponId", values.couponId);
              }
              formData.append("stock", values.stock);
              formData.append("mrp", values.mrp);
              formData.append("offerPrice", values.offerPrice);

              const offerPercentage =
                values.mrp > 0
                  ? Math.round(
                      ((values.mrp - values.offerPrice) / values.mrp) * 100,
                    )
                  : 0;
              formData.append("offerPercentage", offerPercentage);
              values.productImage.forEach((file) => {
                formData.append("productImage", file);
              });
              const result = await dispatch(addAProduct({ formData }));

              console.log("ADD PRODUCT RESULT:", result);

              if (addAProduct.fulfilled.match(result)) {
                handleClose();
              }
            }}
          >
            {({ values, setFieldValue, validateForm, submitForm }) => {
              const discountPercentage =
                values.mrp > 0 && values.offerPrice >= 0
                  ? Math.round(
                      ((values.mrp - values.offerPrice) / values.mrp) * 100,
                    )
                  : 0;
              return (
                <Form>
                  <div className="overflow-x-hidden">
                    <div
                      className="flex transition-transform duration-500"
                      style={{ transform: `translateX(-${step * 100}%)` }}
                    >
                      {/* first set */}

                      <div
                        className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl"
                        inert={step !== 0 ? true : undefined}
                      >
                        <div className="sm:flex justify-between">
                          <div>
                            {/* product Name : */}
                            <label
                              className="font-semibold block"
                              htmlFor="productName"
                            >
                              Product Name :
                            </label>
                            <Field
                              className="p-2 cursor-pointer w-full rounded-lg bg-transparent border-[0.5px] border-black/50 placeholder:text-gray-500"
                              type="text"
                              name="productName"
                              id="productName"
                              placeholder="Add the product name"
                            />

                            <div className="h-5">
                              {stepErrors.productName && (
                                <p className="text-red-500 text-sm">
                                  <TriangleAlert className="size-3 inline-block" />{" "}
                                  {stepErrors.productName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            {/* brand */}
                            <label
                              className="block font-semibold"
                              htmlFor="brand"
                            >
                              Brand Name :
                            </label>
                            <Field
                              className="p-2 cursor-pointer w-full rounded-lg bg-transparent border-[0.5px] border-black/50 placeholder:text-gray-500"
                              type="text"
                              name="brand"
                              id="brand"
                              placeholder="Brand of the product"
                            />
                            <div className="h-5">
                              {stepErrors.brand && (
                                <p className="text-red-500 text-sm">
                                  <TriangleAlert className="size-3 inline-block" />{" "}
                                  {stepErrors.brand}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* productDesc */}
                        <div className="flex justify-between">
                          <label
                            className="font-semibold"
                            htmlFor="productDesc"
                          >
                            Description :
                          </label>
                          <p
                            className={`text-xs ${
                              values.productDesc.length >= 180
                                ? "text-orange-500"
                                : values.productDesc.length < 10
                                  ? "text-gray-500"
                                  : "text-green-300"
                            }`}
                          >
                            {values.productDesc.length}/200
                          </p>
                        </div>

                        <Field
                          as="textarea"
                          rows={4}
                          maxLength={200}
                          minLength={10}
                          className="p-2 rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-500 resize-none"
                          name="productDesc"
                          id="productDesc"
                          placeholder="Add a description (max 200 characters)"
                        />
                        <div className="h-5">
                          {stepErrors.productDesc && (
                            <p className="text-red-500 text-sm">
                              <TriangleAlert className="size-3 inline-block" />{" "}
                              {stepErrors.productDesc}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* second set */}

                      <div
                        className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl"
                        inert={step !== 1 ? true : undefined}
                      >
                        <div className="sm:flex justify-between ">
                          <div className="m-2 mt-4">
                            {/* categoryId*/}
                            <SelectionButton
                              addSearch={true}
                              loading={selectButtonLoading}
                              defaultValue={"Select Category"}
                              zIndex={100}
                              onOpen={() => {
                                dispatch(
                                  fetchAllCategories({
                                    pagination: { page: 1, limit: 15 },
                                  }),
                                );
                              }}
                              onChange={(selectedName) => {
                                const found = category.find(
                                  (cat) => cat.name === selectedName,
                                );
                                if (found)
                                  setFieldValue("categoryId", found._id);
                              }}
                            >
                              {category.map((cat) => cat.name)}
                            </SelectionButton>
                            <div className="h-5">
                              {stepErrors.categoryId && (
                                <p className="text-red-500 text-sm">
                                  <TriangleAlert className="size-3 inline-block" />{" "}
                                  {stepErrors.categoryId}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* sellerId */}
                          <div className="m-2 mt-4 relative">
                            <SelectionButton
                              addSearch={true}
                              loading={selectButtonLoading}
                              zIndex={100}
                              defaultValue={"Select Seller"}
                              onOpen={() => {
                                dispatch(
                                  fetchAllSellers({
                                    pagination: { page: 1, limit: 15 },
                                  }),
                                );
                              }}
                              onChange={(selectedName) => {
                                const found = seller.find((sell) => {
                                  const name =
                                    sell.firstName + " " + sell.lastName;
                                  return name === selectedName;
                                });
                                if (found) setFieldValue("sellerId", found._id);
                              }}
                            >
                              {seller.map((sel) => {
                                const name = sel.firstName + " " + sel.lastName;
                                return name;
                              })}
                            </SelectionButton>
                            <div className="h-5">
                              {stepErrors.sellerId && (
                                <p className="text-red-500 text-sm">
                                  <TriangleAlert className="size-3 inline-block" />{" "}
                                  {stepErrors.sellerId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* coupon  */}
                        <div className="m-2 mt-4">
                          <SelectionButton
                            addSearch={true}
                            zIndex={100}
                            defaultValue={"Select Coupon"}
                            onChange={(selectedName) => {
                              const found = seller.find(
                                (sell) => sell.name === selectedName,
                              );
                              if (found) setFieldValue("categoryId", found._id);
                            }}
                          >
                            {filter}
                          </SelectionButton>
                        </div>
                        <div className="h-5">
                          {stepErrors.couponId && (
                            <p className="text-red-500 text-sm">
                              <TriangleAlert className="size-3 inline-block" />{" "}
                              {stepErrors.couponId}
                            </p>
                          )}
                        </div>

                        {/* stock  */}
                        <label className="font-semibold">Stock :</label>
                        <Field
                          className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-500"
                          type="number"
                          name="stock"
                          id="stock"
                          placeholder="Stock available"
                        />
                        <div className="h-5">
                          {stepErrors.stock && (
                            <p className="text-red-500 text-sm">
                              <TriangleAlert className="size-3 inline-block" />{" "}
                              {stepErrors.stock}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* third set  */}

                      <div
                        className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl"
                        inert={step !== 2 ? true : undefined}
                      >
                        <label className="font-semibold block">MRP :</label>
                        <Field
                          className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-500"
                          type="number"
                          name="mrp"
                          id="mrp"
                          placeholder="Maximum Retail Price"
                        />
                        <div className="h-5">
                          {stepErrors.mrp && (
                            <p className="text-red-500 text-sm">
                              <TriangleAlert className="size-3 inline-block" />{" "}
                              {stepErrors.mrp}
                            </p>
                          )}
                        </div>

                        <label className="font-semibold block">
                          Seller Price :
                        </label>
                        <Field
                          className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-500"
                          type="number"
                          name="offerPrice"
                          id="offerPrice"
                          placeholder="Price you sell"
                        />
                        <div className="h-5">
                          {stepErrors.offerPrice && (
                            <p className="text-red-500 text-sm">
                              <TriangleAlert className="size-3 inline-block" />{" "}
                              {stepErrors.offerPrice}
                            </p>
                          )}
                        </div>
                        <label className="font-semibold block">
                          Discount Percentage :
                        </label>
                        <div className="p-2 rounded-lg border-[0.5px] border-black/50 bg-gray-50">
                          {discountPercentage}% OFF
                        </div>
                        <div className="h-5">
                          {stepErrors.offerPercentage && (
                            <p className="text-red-500 text-sm">
                              <TriangleAlert className="size-3 inline-block" />{" "}
                              {stepErrors.offerPercentage}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* fourth set — product images */}

                      <div
                        className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl"
                        inert={step !== 3 ? true : undefined}
                      >
                        <label className="font-semibold block mb-2">
                          Product Images :
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                          Upload up to 10 images (JPEG, PNG, WebP · max 2MB
                          each)
                        </p>

                        {/* upload area */}
                        <label
                          htmlFor="productImage"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-black/30 rounded-xl cursor-pointer hover:border-[#5f0000] transition-colors"
                        >
                          <Plus className="size-6 text-gray-400 mb-1" />
                          <span className="text-sm text-gray-500">
                            Click to upload images
                          </span>
                          <input
                            id="productImage"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);
                              const existing = values.productImage || [];

                              // cap at 10 total
                              const slots = 10 - existing.length;
                              const selected = files.slice(0, slots);

                              // compress + crop each file
                              const processed = await Promise.all(
                                selected.map((file) =>
                                  handleImage(file, "product"),
                                ),
                              );

                              setFieldValue("productImage", [
                                ...existing,
                                ...processed,
                              ]);
                              e.target.value = ""; // reset input so same file can be re-added
                            }}
                          />
                        </label>

                        {/* error */}
                        <div className="h-5 mt-1">
                          {stepErrors.productImage && (
                            <p className="text-red-500 text-sm">
                              <TriangleAlert className="size-3 inline-block" />{" "}
                              {stepErrors.productImage}
                            </p>
                          )}
                        </div>

                        {/* preview grid */}
                        {values.productImage?.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {values.productImage.map((file, i) => (
                              <div key={i} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`product-${i}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                                {/* remove button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = values.productImage.filter(
                                      (_, idx) => idx !== i,
                                    );
                                    setFieldValue("productImage", updated);
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="size-3" />
                                </button>
                                {/* index badge */}
                                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                                  {i + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          {values.productImage?.length ?? 0} / 10 images added
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    className={"bg-[#5f0000]"}
                    type={"button"}
                    disabled={step === 3 && isProductLoading}
                    onClick={async () => {
                      const stepFields = [
                        ["productName", "brand", "productDesc"],
                        ["categoryId", "sellerId", "stock"],
                        ["mrp", "offerPrice"],
                        ["productImage"],
                      ][step];

                      const errors = await validateForm();

                      const currentErrors = {};
                      stepFields.forEach((f) => {
                        if (errors[f]) currentErrors[f] = errors[f];
                      });

                      if (Object.keys(currentErrors).length > 0) {
                        setStepErrors(currentErrors);
                        return;
                      }

                      setStepErrors({});

                      if (step === 3) {
                        submitForm();
                        return;
                      }

                      setStep((prev) => prev + 1);
                    }}
                  >
                    {step === 3 ? (
                      isProductLoading ? (
                        <Loading className={"size-6"} />
                      ) : (
                        "Upload Product"
                      )
                    ) : (
                      "Next"
                    )}
                  </Button>
                  <Button
                    type="button"
                    disabled={step === 0}
                    onClick={() => {
                      setStepErrors({});
                      if (step > 0) {
                        setStep((prev) => prev - 1);
                      }
                    }}
                    variant="secondary"
                  >
                    Go Back
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </FormCard>
  );
}

export default ProductListTile;
