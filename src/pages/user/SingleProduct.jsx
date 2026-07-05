import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import RelatedSuggestion from "../../components/ui/RelatedSuggestion";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductError,
  clearProductState,
  singleProductFetch,
} from "../../redux/slice/productSlice";
import { useParams } from "react-router-dom";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import {
  clearCategoryState,
  singleCategoryFetch,
} from "../../redux/slice/categorySlice";
import {
  clearSellerState,
  singleSellerFetch,
} from "../../redux/slice/sellerSlice";
import { useToastError } from "../../hooks/useToastError";
import H1 from "../../components/ui/H1";
import P2 from "../../components/ui/P2";
import P from "../../components/ui/P";

const defaultProduct = {
  subcategory: "Coats",
  sku: "OM-7741-BLK",
  reviewCount: 128,
  sizes: ["XS", "S", "M", "L", "XL"],
  specs: [
    { label: "Material", value: "80% Wool, 20% Nylon" },
    { label: "Fit", value: "Relaxed" },
    { label: "Care", value: "Dry clean only" },
    { label: "Origin", value: "Made in Portugal" },
  ],
};

const relatedDefaults = [
  {
    name: "Felt Wool Cap",
    price: 1299,
    image: "https://placehold.co/400x500/0a0a0a/ffffff?text=Cap",
  },
  {
    name: "Merino Crewneck",
    price: 2199,
    image: "https://placehold.co/400x500/0a0a0a/ffffff?text=Knit",
  },
  {
    name: "Tailored Wool Trouser",
    price: 2899,
    image: "https://placehold.co/400x500/0a0a0a/ffffff?text=Trouser",
  },
  {
    name: "Leather Ankle Boot",
    price: 5499,
    image: "https://placehold.co/400x500/0a0a0a/ffffff?text=Boot",
  },
  {
    name: "Leather Ankle Boot",
    price: 5499,
    image: "https://placehold.co/400x500/0a0a0a/ffffff?text=Boot",
  },
];

function ProductPage({ product = defaultProduct, related = relatedDefaults }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState("description");

  //product selector
  const { singleProduct, isProductLoading, productError } = useSelector(
    (state) => state.product,
  );
  //seller selector
  const { singleSeller, isSellerLoading } = useSelector(
    (state) => state.seller,
  );
  //category selector
  const { singleCategory } = useSelector((state) => state.category);

  console.log("SINGLE SELLER :", singleSeller);
  console.log("SINGLE CATEGORY :", singleCategory);
  console.log("SINGLE PRODUCT error :", productError);

  //product fetch
  useEffect(() => {
    dispatch(singleProductFetch({ id }));

    return () => {
      dispatch(clearProductState());
      dispatch(clearSellerState());
      dispatch(clearCategoryState());
    };
  }, [id]);
  useEffect(() => {
    if (singleProduct?.sellerId) {
      dispatch(singleSellerFetch({ id: singleProduct.sellerId }));
    }
  }, [singleProduct?.sellerId]);

  useEffect(() => {
    if (singleProduct?.categoryId) {
      dispatch(singleCategoryFetch({ id: singleProduct.categoryId }));
    }
  }, [singleProduct?.categoryId]);

  //toastify error
  useToastError({
    errorMessage: productError,
    fallbackErrorMessage: "Failed to load products",
  });
  useEffect(() => {
    return () => {
      dispatch(clearProductError());
    };
  }, []);

  const toggleSection = (key) =>
    setOpenSection((prev) => (prev === key ? null : key));

  return (
    <>
      <div className="w-full h-16"></div>
      {isProductLoading && (
        <div className="flex w-full h-screen items-center justify-center">
          <CartLoading />
        </div>
      )}

      {!isProductLoading && singleProduct?._id && !productError && (
        <div className="min-h-screen bg-white text-black">
          {/* Breadcrumb */}
          <div className="mx-auto max-w-6xl px-6 pt-6">
            <nav className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-neutral-500">
              <ChevronRight className="size-3" />
              <span>{singleCategory.name}</span>
              <ChevronRight className="size-3" />
              <span className="text-black">{singleCategory.subcategory}</span>
            </nav>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[1.5fr_1fr] ">
            {/* Main image */}
            <div>
              <div className="order-1 lg:order-2">
                <div className="aspect-[16/9] relative rounded-xl w-full overflow-hidden border border-neutral-200">
                  {/* Replace the single <img> with a sliding strip */}
                  <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${activeImage * 100}%)` }}
                  >
                    {singleProduct.productImage.map((img, i) => (
                      <img
                        key={i}
                        src={img.url}
                        alt={singleProduct.productName}
                        className="h-full w-full object-cover shrink-0"
                      />
                    ))}
                  </div>

                  {/* Add onClick to the existing buttons — everything else stays the same */}
                  <div
                    className={` ${singleProduct.productImage.length === 1 ? "hidden" : "block"}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full z-10"
                    >
                      ❮
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImage((i) =>
                          Math.min(
                            singleProduct.productImage.length - 1,
                            i + 1,
                          ),
                        )
                      }
                      className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full z-10`}
                    >
                      ❯
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail rail */}
              <div className="order-2 mt-10 flex gap-3 w-36 aspect-[16/9] overflow-x-auto lg:order-1 lg:overflow-visible">
                {singleProduct.productImage.slice(0, 4).map((img, index) => {
                  const isOverflow =
                    index === 3 && singleProduct.productImage.length > 4;
                  const remainingCount = singleProduct.productImage.length - 3;

                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative rounded-xl w-16 p-1 shrink-0 overflow-hidden lg:w-full ${
                        activeImage === index ? "border border-black" : ""
                      }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="h-full w-full rounded-xl object-cover"
                      />
                      {isOverflow && (
                        <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center text-white">
                          <Plus className="size-4" />
                          <span className="text-xs font-medium">
                            {remainingCount}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info panel */}
            <div className="order-3 lg:order-3">
              <H1 className="font-serif text-left leading-tight tracking-tight">
                {singleProduct.productName}
              </H1>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-black text-black" />
                  <span className="text-sm font-medium">
                    {singleProduct?.rating}
                  </span>
                </div>
                <span className="text-sm text-neutral-500">
                  {singleProduct.reviewCount} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-2xl font-semibold">
                  ₹{singleProduct.offerPrice.toLocaleString()}
                </span>
                <span className="text-base text-neutral-400 line-through">
                  ₹{singleProduct.mrp.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-neutral-700">
                  {singleProduct.offerPercentage}% off
                </span>
              </div>

              {/* Spec tag — signature element: a catalog/garment-tag block */}
              <div className="mt-6 border border-black font-mono text-[11px] uppercase tracking-wide">
                <div className="grid grid-cols-3 divide-x divide-black">
                  <div className="px-3 py-2">
                    <p className="text-neutral-400">SKU</p>
                    <p className="mt-0.5">{product.sku}</p>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-neutral-400">Category</p>
                    <p className="mt-0.5">{singleCategory.name}</p>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-neutral-400">In Stock</p>
                    <p className="mt-0.5">{singleProduct.stock} units</p>
                  </div>
                </div>
              </div>

              {/* Seller card */}
              {singleSeller && !isSellerLoading && (
                <div className="mt-6 flex items-center justify-between border-y border-neutral-200 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-full border border-black text-sm font-semibold overflow-hidden">
                      {singleSeller.profileImage.url ? (
                        <img
                          src={singleSeller.profileImage.url}
                          alt={singleSeller.firstName}
                          className="size-full rounded-full object-cover"
                        />
                      ) : (
                        singleSeller.firstName.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          {singleSeller.firstName + " " + singleSeller.lastName}
                        </span>
                        {singleSeller.isVerified && (
                          <BadgeCheck className="size-4 fill-green-500 text-white" />
                        )}
                      </div>
                      <P2 className="text-xs text-left text-neutral-500">
                        {singleSeller?.rating ? singleSeller.rating : "0"}{" "}
                        rating ·{" "}
                        {singleSeller?.sales ? singleSeller.sales : "0"} sales
                      </P2>
                    </div>
                  </div>
                  <button className="text-xs font-medium underline underline-offset-2">
                    View store
                  </button>
                </div>
              )}

              {/* Size selector */}
              <div className="mt-6">
                <P2 className="text-xs text-left font-medium uppercase tracking-wide text-neutral-500">
                  Select size
                </P2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 w-12 items-center justify-center border text-sm transition-colors ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + actions */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center border border-neutral-300">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex size-10 items-center justify-center hover:bg-neutral-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex size-10 items-center justify-center hover:bg-neutral-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <Button variant={"secondary"} className="mt-0 flex-1">
                  Add to Cart
                </Button>

                <button
                  className="flex size-10 items-center justify-center border border-neutral-300 hover:border-black"
                  aria-label="Add to wishlist"
                >
                  <Heart className="size-4" />
                </button>
                <button
                  className="flex size-10 items-center justify-center border border-neutral-300 hover:border-black"
                  aria-label="Share product"
                >
                  <Share2 className="size-4" />
                </button>
              </div>
              <div className="mt-4">
                <Button>Buy Now</Button>
              </div>
            </div>
          </div>
          {/* Accordion sections */}
          <div className="mt-8 divide-y mx-auto max-w-6xl divide-neutral-200 border-t border-neutral-200">
            <AccordionRow
              title="Description"
              isOpen={openSection === "description"}
              onToggle={() => toggleSection("description")}
            >
              <P className="text-sm text-left leading-relaxed text-neutral-600">
                {singleProduct.productDesc}
              </P>
            </AccordionRow>

            <AccordionRow
              title="Specifications"
              isOpen={openSection === "specifications"}
              onToggle={() => toggleSection("specifications")}
            >
              <dl className="space-y-2 text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between">
                    <dt className="text-neutral-500">{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionRow>

            <AccordionRow
              title="Shipping & Returns"
              isOpen={openSection === "shipping"}
              onToggle={() => toggleSection("shipping")}
            >
              <P2 className="text-sm text-left leading-relaxed text-neutral-600">
                Delivered in 3–5 business days. Free returns within 30 days of
                delivery, unworn and with original tags.
              </P2>
            </AccordionRow>
          </div>

          <RelatedSuggestion product={product} related={related} />
        </div>
      )}

      <ErrorFallback loading={isProductLoading} error={productError} />
    </>
  );
}

function AccordionRow({ title, isOpen, onToggle, children }) {
  return (
    <div className="py-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-medium">{title}</span>
        <ChevronDown
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default ProductPage;
