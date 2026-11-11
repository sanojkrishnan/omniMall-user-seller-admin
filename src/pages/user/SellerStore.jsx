import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Mail,
  MapPin,
  Package,
  Phone,
  SearchX,
  Star,
  Store,
  Truck,
} from "lucide-react";
import ProductCard from "../../components/ui/ProductCard";
import { SearchBar } from "../../components/ui/SearchBar";

/* ----------------------------- static data ----------------------------- */

const IMG = "/logo and other utilities/lipstick_profile.jpg";

// public view of a seller (pickupLocation is private, so it is not shown)
const seller = {
  storeName: "Aarav Lifestyle Store",
  businessLogo: IMG,
  productCategories: ["Fashion", "Beauty", "Accessories", "Home & Kitchen"],
  description:
    "Everyday fashion, beauty and accessories from Kerala, packed and shipped within 24 hours.",
  businessEmail: "store@aaravlifestyle.in",
  businessPhone: "9876543210",
  businessAddress: "Market Road, Kanhangad, Kerala 671315",
  status: "active",
  createdAt: "November 2026",
  orders: 640,
  rating: 4.3,
  reviews: 386,
};

// same shape ProductCard expects (+ `category` used for the filter)
const mk = (
  id,
  productName,
  category,
  mrp,
  offerPrice,
  rating,
  withImage = true,
) => ({
  _id: id,
  productName,
  category,
  productDesc: `${productName} from ${seller.storeName}. Quality checked and shipped within 24 hours.`,
  productImage: withImage ? [{ url: IMG }] : [],
  mrp,
  offerPrice,
  offerPercentage: Math.round(((mrp - offerPrice) / mrp) * 100),
  rating,
});

const allProducts = [
  mk("p1", "Cotton T-Shirt", "Fashion", 599, 299, 4.5),
  mk("p2", "Steel Water Bottle", "Home & Kitchen", 499, 199, 4.2),
  mk("p3", "Matte Lipstick", "Beauty", 399, 199, 4.7),
  mk("p4", "Leather Wallet", "Accessories", 899, 299, 3.6, false),
  mk("p5", "Phone Case", "Accessories", 299, 149, 3.2),
  mk("p6", "Denim Jacket", "Fashion", 2499, 1499, 4.4),
  mk("p7", "Face Serum", "Beauty", 799, 549, 4.6),
  mk("p8", "Lunch Box Set", "Home & Kitchen", 699, 449, 4.1, false),
];

const DEFAULT_FILTERS = {
  category: "",
  minPrice: 0,
  maxPrice: 1000000,
  priceSort: "",
  sort: "",
};

/* ---------------------------- small helpers ---------------------------- */

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex-1 min-w-[110px] text-center text-xs p-3 border-r last:border-r-0">
      <Icon className="size-4 mx-auto mb-1" />
      <h5 className="text-gray-500">{label}</h5>
      <p className="font-bold text-base mt-1 whitespace-nowrap">{value}</p>
    </div>
  );
}

function ContactItem({ icon: Icon, href, children }) {
  const content = (
    <span className="flex items-center gap-2 text-sm break-words">
      <Icon className="size-4 shrink-0" />
      {children}
    </span>
  );
  return href ? (
    <a href={href} className="hover:underline">
      {content}
    </a>
  ) : (
    content
  );
}

/* ------------------------------ component ------------------------------ */

function SellerStore() {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTERS);

  // client side filtering for the static page.
  // When the backend is ready, send the same values as query params instead.
  const products = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = Number(filterValues.minPrice) || 0;
    const max =
      filterValues.maxPrice === "" ? Infinity : Number(filterValues.maxPrice);
    const category = String(filterValues.category || "").toLowerCase();
    const sort = String(filterValues.priceSort || "").toLowerCase();

    const list = allProducts.filter(
      (p) =>
        (!q ||
          p.productName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)) &&
        (!category || p.category.toLowerCase() === category) &&
        p.offerPrice >= min &&
        p.offerPrice <= max,
    );

    if (sort.includes("asc")) list.sort((a, b) => a.offerPrice - b.offerPrice);
    else if (sort.includes("desc"))
      list.sort((a, b) => b.offerPrice - a.offerPrice);
    return list;
  }, [search, filterValues]);

  return (
    <div className="max-w-6xl mx-auto px-2 pb-10">
      {/* spacer for the navbar */}
      <div className="h-24" />

      {/* store card */}
      <section
        aria-label="Seller profile"
        className="shadow-md border rounded-lg overflow-hidden"
      >
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-28 h-28 rounded-full border overflow-hidden shrink-0 flex items-center justify-center">
            {seller.businessLogo ? (
              <img
                src={seller.businessLogo}
                alt={`${seller.storeName} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store className="size-10" />
            )}
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-bold break-words">
                {seller.storeName}
              </h1>
              <span className="inline-flex items-center gap-1 text-xs border rounded-lg px-2 py-1 bg-green-500/10 text-green-500 border-green-500">
                <BadgeCheck className="size-3.5" /> Verified seller
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selling on OmniMall since {seller.createdAt}
            </p>
            <p className="text-sm mt-3 max-w-2xl">{seller.description}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {seller.productCategories.map((c) => (
                <span key={c} className="text-xs border rounded-full px-2 py-1">
                  {c}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4 items-center sm:items-start">
              <ContactItem icon={Mail} href={`mailto:${seller.businessEmail}`}>
                {seller.businessEmail}
              </ContactItem>
              <ContactItem icon={Phone} href={`tel:+91${seller.businessPhone}`}>
                +91 {seller.businessPhone}
              </ContactItem>
              <ContactItem icon={MapPin}>{seller.businessAddress}</ContactItem>
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto border-t">
          <Stat icon={Package} label="Products" value={allProducts.length} />
          <Stat icon={Truck} label="Orders" value={seller.orders} />
          <Stat
            icon={Star}
            label={`Rating (${seller.reviews})`}
            value={`${seller.rating} / 5`}
          />
        </div>
      </section>

      {/* products */}
      <section aria-label="Seller products" className="mt-8">
        <h2 className="text-lg font-semibold px-4">
          Products by {seller.storeName}
        </h2>

        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          onFilterApply={({ minPrice, maxPrice }) =>
            setFilterValues((prev) => ({ ...prev, minPrice, maxPrice }))
          }
          filterOn="products"
        />

        <p className="text-xs text-gray-500 px-4 mb-4" aria-live="polite">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>

        {products.length > 0 ? (
          <div className="px-4">
            <ProductCard products={products} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
            <SearchX className="size-10" />
            <p className="text-sm">No products match your search or filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SellerStore;
