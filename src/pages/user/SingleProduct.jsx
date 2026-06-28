import { useState } from "react";
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

const defaultProduct = {
  name: "Cosmos Wool Overcoat",
  category: "Outerwear",
  subcategory: "Coats",
  sku: "OM-7741-BLK",
  price: 4499,
  mrp: 5999,
  rating: 4.6,
  reviewCount: 128,
  stock: 12,
  description:
    "Tailored from a heavyweight wool blend, cut for a relaxed silhouette that layers easily over knitwear. Finished with horn buttons and a half-belt back.",
  images: [
    "https://placehold.co/640x800/0a0a0a/ffffff?text=01",
    "https://placehold.co/640x800/1a1a1a/ffffff?text=02",
    "https://placehold.co/640x800/2a2a2a/ffffff?text=03",
    "https://placehold.co/640x800/3a3a3a/ffffff?text=04",
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
  seller: {
    name: "Norden & Co.",
    verified: true,
    rating: 4.8,
    sales: "12.4k",
  },
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
];

function ProductPage({ product = defaultProduct, related = relatedDefaults }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState("description");

  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100,
  );

  const toggleSection = (key) =>
    setOpenSection((prev) => (prev === key ? null : key));

  return (
    <>
      <div className="w-full h-24"></div>
      <div className="min-h-screen bg-white text-black">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <nav className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-neutral-500">
            <span>Home</span>
            <ChevronRight className="size-3" />
            <span>{product.category}</span>
            <ChevronRight className="size-3" />
            <span className="text-black">{product.subcategory}</span>
          </nav>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[88px_1fr_1fr]">
          {/* Thumbnail rail */}
          <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden border lg:w-full ${
                  activeImage === i ? "border-black" : "border-neutral-200"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] w-full overflow-hidden border border-neutral-200">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Info panel */}
          <div className="order-3 lg:order-3">
            <h1 className="font-serif text-3xl leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-black text-black" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-neutral-500">
                {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-base text-neutral-400 line-through">
                ₹{product.mrp.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-neutral-700">
                {discount}% off
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
                  <p className="mt-0.5">{product.category}</p>
                </div>
                <div className="px-3 py-2">
                  <p className="text-neutral-400">In Stock</p>
                  <p className="mt-0.5">{product.stock} units</p>
                </div>
              </div>
            </div>

            {/* Seller card */}
            <div className="mt-6 flex items-center justify-between border-y border-neutral-200 py-4">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full border border-black text-sm font-semibold">
                  {product.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">
                      {product.seller.name}
                    </span>
                    {product.seller.verified && (
                      <BadgeCheck className="size-4 fill-black text-white" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {product.seller.rating} rating · {product.seller.sales}{" "}
                    sales
                  </p>
                </div>
              </div>
              <button className="text-xs font-medium underline underline-offset-2">
                View store
              </button>
            </div>

            {/* Size selector */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Select size
              </p>
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

              <button className="h-10 flex-1 bg-black text-sm font-medium text-white transition-opacity hover:opacity-85">
                Add to Cart
              </button>

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

            {/* Accordion sections */}
            <div className="mt-8 divide-y divide-neutral-200 border-t border-neutral-200">
              <AccordionRow
                title="Description"
                isOpen={openSection === "description"}
                onToggle={() => toggleSection("description")}
              >
                <p className="text-sm leading-relaxed text-neutral-600">
                  {product.description}
                </p>
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
                <p className="text-sm leading-relaxed text-neutral-600">
                  Delivered in 3–5 business days. Free returns within 30 days of
                  delivery, unworn and with original tags.
                </p>
              </AccordionRow>
            </div>
          </div>
        </div>

        {/* Related — category based */}
        <div className="mx-auto max-w-6xl border-t border-neutral-200 px-6 py-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium">More in {product.category}</h2>
            <button className="text-xs font-medium underline underline-offset-2">
              View all
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {related.map((item, i) => (
              <a key={i} href="#" className="group block">
                <div className="aspect-[4/5] overflow-hidden border border-neutral-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-sm">{item.name}</p>
                <p className="text-sm font-medium">
                  ₹{item.price.toLocaleString()}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
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
