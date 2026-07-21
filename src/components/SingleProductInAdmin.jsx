import { useState } from "react";
import { Button } from "./ui/Button";
import { useCurrency } from "../hooks/useCurrency";
import { useDateFormatter } from "../hooks/useDateFormatter";
import { AdminStockBar, FieldRow, SectionLabel } from "./AdminProductSupport";

// COLOR PALETTE (for reference — used as Tailwind arbitrary values below)
// OXBLOOD #5f0000 · INK #241a1a · STONE #8a7873 · HAIRLINE #e8e1df
// PAPER_TINT #faf7f6 · SUCCESS #3f6b52 · SUCCESS_BG #eef4f0
// AMBER #a97327 · AMBER_BG #faf3e7

const product = {
  id: "6a4a41dc4e2a2b76f619961a",
  productName: "Samsung Galaxy S25 Ultra",
  brand: "Samsung",
  productDesc:
    "Flagship Android phone with S-Pen, 200MP camera and AI features.",
  category: { id: "6a493ee8d8dca79e5dd3c9df", name: "Smartphones" },
  seller: {
    id: "6a213d5a23da8241fc385b3d",
    name: "TechHub Retail Pvt Ltd",
    rating: 4.6,
    totalListings: 128,
    joined: "2024-03-11T00:00:00.000+00:00",
  },
  couponId: null,
  stock: 40,
  mrp: 129999,
  offerPrice: 119999,
  offerPercentage: 8,
  ordered: 0,
  productImage: [
    {
      url: "https://placehold.co/500x500?text=Front",
      publicId: "seed_samsung_galaxy_s25_ultra_1",
    },
    {
      url: "https://placehold.co/500x500?text=Back",
      publicId: "seed_samsung_galaxy_s25_ultra_2",
    },
    {
      url: "https://placehold.co/500x500?text=Side",
      publicId: "seed_samsung_galaxy_s25_ultra_3",
    },
    {
      url: "https://placehold.co/500x500?text=Box",
      publicId: "seed_samsung_galaxy_s25_ultra_4",
    },
  ],
  createdAt: "2026-07-05T11:37:00.611+00:00",
  updatedAt: "2026-07-05T11:37:00.611+00:00",
  version: 0,
};

export default function ProductAdminView() {
  const [tab, setTab] = useState("overview");
  const [activeImg, setActiveImg] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const currency = useCurrency(); //digit to currency
  const formatDate = useDateFormatter(); // formats dates into readable date values

  const inStock = product.stock > 0;
  const savings = product.mrp - product.offerPrice;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing & stock" },
    { id: "seller", label: "Seller & category" },
    { id: "record", label: "Record" },
  ];

  return (
    <div className="font-sans text-[#241a1a] min-h-screen">
      <style>{`
        * { box-sizing: border-box; }
        table { border-collapse: collapse; width: 100%; }
        .row-hover:hover { background: #faf7f6; }
      `}</style>

      <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div className="text-[13px] text-[#8a7873] flex items-center gap-1.5">
          <span>Products</span>
          <span className="opacity-50">/</span>
          <span>{product.category.name}</span>
          <span className="opacity-50">/</span>
          <span className="text-[#241a1a] font-medium">
            {product.productName}
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
            onMouseLeave={() => setConfirmDelete(false)}
            onClick={() => setConfirmDelete((v) => !v)}
            className="relative border border-[#5f0000] bg-[#5f0000] text-white rounded-md px-4 py-2 text-[13px] font-semibold cursor-pointer"
          >
            Delete product
            {confirmDelete && (
              <div className="absolute top-[calc(100%+6px)] right-0 bg-white border border-[#e8e1df] rounded-lg p-3 w-[220px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-left z-10">
                <div className="text-[12.5px] text-[#241a1a] mb-2.5 font-medium">
                  Permanently delete this listing? This can't be undone.
                </div>
                <div className="flex gap-1.5">
                  <Button className="flex-1 border border-[#5f0000] bg-[#5f0000] text-white rounded-md py-1.5 text-[12.5px] font-semibold cursor-pointer">
                    Confirm
                  </Button>
                  <Button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 border border-[#e8e1df] bg-white text-[#241a1a] rounded-md py-1.5 text-[12.5px] font-medium cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="flex border border-[#e8e1df] rounded-xl overflow-hidden">
        <div className="w-[5px] bg-[#5f0000] shrink-0" />

        <div className="flex flex-1 min-w-0">
          <div className="w-[36%] p-7 border-r border-[#e8e1df]">
            <div className="aspect-square rounded-[10px] overflow-hidden bg-[#faf7f6] border border-[#e8e1df]">
              <img
                src={product.productImage[activeImg].url}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2 mt-2.5">
              {product.productImage.map((img, i) => (
                <Button
                  key={img.publicId}
                  onClick={() => setActiveImg(i)}
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
              {product.productImage.length} images &middot;{" "}
              {product.productImage[activeImg].publicId}
            </div>

            <div className="mt-6">
              <SectionLabel>Attributes</SectionLabel>
              <div className="flex justify-between py-[7px] text-[13px]">
                <span className="text-[#8a7873]">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between py-[7px] text-[13px]">
                <span className="text-[#8a7873]">Category</span>
                <span className="font-medium">{product.category.name}</span>
              </div>
              <div className="flex justify-between py-[7px] text-[13px]">
                <span className="text-[#8a7873]">Coupon</span>
                <span className="font-medium">
                  {product.couponId ? product.couponId : "None applied"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-7 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="font-sans font-semibold text-[26px] m-0 text-[#241a1a]">
                  {product.productName}
                </h1>
                <div className="font-mono text-xs text-[#8a7873] mt-1.5">
                  {product.id}
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
                {currency(product.offerPrice)}
              </span>
              <span className="font-mono text-sm text-[#8a7873] line-through">
                {currency(product.mrp)}
              </span>
              <span className="text-xs text-[#3f6b52] bg-[#eef4f0] px-2 py-[3px] rounded">
                {product.offerPercentage}% off
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
                    {product.productDesc}
                  </p>
                  <SectionLabel>Snapshot</SectionLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["In stock", product.stock],
                      ["Units ordered", product.ordered],
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
                          {currency(product.mrp)}
                        </td>
                      </tr>
                      <tr className="border-t border-[#e8e1df] row-hover">
                        <td className="py-2.5 px-2 text-[13px] text-[#8a7873]">
                          Offer price
                        </td>
                        <td className="py-2.5 px-2 text-[13px] font-mono text-right font-medium">
                          {currency(product.offerPrice)}
                        </td>
                      </tr>
                      <tr className="border-t border-[#e8e1df] row-hover">
                        <td className="py-2.5 px-2 text-[13px] text-[#8a7873]">
                          Discount
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <span className="text-xs font-medium px-2 py-[3px] rounded bg-[#eef4f0] text-[#3f6b52]">
                            {product.offerPercentage}%
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
                      <AdminStockBar stock={product.stock} />
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-2 border-t border-[#e8e1df]">
                      <span className="text-[13px] text-[#8a7873]">
                        Units ordered
                      </span>
                      <span className="font-mono text-[13px]">
                        {product.ordered}
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
                      {product.seller.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {product.seller.name}
                      </div>
                      <div className="text-xs text-[#8a7873]">
                        Rating {product.seller.rating} &middot;{" "}
                        {product.seller.totalListings} listings
                      </div>
                    </div>
                  </div>
                  <FieldRow label="Seller ID" value={product.seller.id} mono />
                  <FieldRow
                    label="Joined"
                    value={formatDate(product.seller.joined)}
                  />

                  <div className="mt-6">
                    <SectionLabel>Category</SectionLabel>
                    <FieldRow label="Name" value={product.category.name} />
                    <FieldRow
                      label="Category ID"
                      value={product.category.id}
                      mono
                    />
                  </div>
                </div>
              )}

              {tab === "record" && (
                <div>
                  <SectionLabel>Database record</SectionLabel>
                  <FieldRow label="_id" value={product.id} mono />
                  <FieldRow
                    label="categoryId"
                    value={product.category.id}
                    mono
                  />
                  <FieldRow label="sellerId" value={product.seller.id} mono />
                  <FieldRow
                    label="couponId"
                    value={
                      product.couponId === null ? "null" : product.couponId
                    }
                    mono
                  />
                  <FieldRow label="__v" value={product.version} mono />
                  <FieldRow
                    label="createdAt"
                    value={formatDate(product.createdAt)}
                    mono
                  />
                  <FieldRow
                    label="updatedAt"
                    value={formatDate(product.updatedAt)}
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