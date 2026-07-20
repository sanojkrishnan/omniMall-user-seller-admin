import { useState } from "react";
import { Button } from "./ui/Button";

// ---------------------------------------------------------
// COLOR PALETTE
// Change these hex values to re-theme the whole page.
// ---------------------------------------------------------
const OXBLOOD = "#5f0000"; // primary brand color (buttons, accents, borders)
const INK = "#241a1a"; // main text color (near-black, warm tone)
const STONE = "#8a7873"; // secondary/muted text (labels, captions)
const HAIRLINE = "#e8e1df"; // light borders/dividers
const PAPER_TINT = "#faf7f6"; // very light background for cards/panels
const SUCCESS = "#3f6b52"; // green - used for "in stock", discounts, positive states
const SUCCESS_BG = "#eef4f0"; // light green background behind SUCCESS text
const AMBER = "#a97327"; // amber/orange - used for warnings, low stock, flags
const AMBER_BG = "#faf3e7"; // light amber background behind AMBER text

// Plain system fonts only (no external font files loaded)
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"; // normal text
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"; // used for IDs, prices, numbers

// ---------------------------------------------------------
// MOCK PRODUCT DATA
// Replace this whole object with data from your API/database.
// Structure matches your MongoDB document (categoryId, sellerId, etc.)
// ---------------------------------------------------------
const product = {
  id: "6a4a41dc4e2a2b76f619961a", // _id from the database
  productName: "Samsung Galaxy S25 Ultra",
  brand: "Samsung",
  productDesc:
    "Flagship Android phone with S-Pen, 200MP camera and AI features.",
  category: { id: "6a493ee8d8dca79e5dd3c9df", name: "Smartphones" }, // categoryId + a display name (name would normally come from a separate categories lookup)
  seller: {
    id: "6a213d5a23da8241fc385b3d", // sellerId
    name: "TechHub Retail Pvt Ltd", // extra seller info you'd fetch by joining on sellerId
    rating: 4.6,
    totalListings: 128,
    joined: "2024-03-11T00:00:00.000+00:00",
  },
  couponId: null, // null = no coupon currently attached
  stock: 40, // units available
  mrp: 129999, // original listed price
  offerPrice: 119999, // discounted/selling price
  offerPercentage: 8, // % off, shown as a badge
  ordered: 0, // how many units have been sold/ordered so far
  productImage: [
    // array so it supports 1 or many images
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
  version: 0, // mongoose's __v field
};

// ---------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------

// Formats a number as Indian Rupees, e.g. 119999 -> "₹1,19,999"
function currency(n) {
  return `\u20b9${n.toLocaleString("en-IN")}`;
}

// Formats an ISO date string into a readable "05 Jul 2026, 05:07 PM" style string
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------
// SMALL REUSABLE COMPONENTS
// ---------------------------------------------------------

// Little horizontal bar showing stock level, colored green/amber/red depending on how low it is.
// "max" just controls what counts as a "full" bar visually — tweak if your typical stock levels differ.
function StockBar({ stock, max = 100 }) {
  const pct = Math.min(100, Math.round((stock / max) * 100));
  const color = stock === 0 ? OXBLOOD : stock <= 10 ? AMBER : SUCCESS; // red if none left, amber if low, green otherwise
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 72,
          height: 5,
          background: HAIRLINE,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: color }} />
      </div>
      <span style={{ fontFamily: MONO, fontSize: 12, color: INK }}>
        {stock}
      </span>
    </div>
  );
}

// Small uppercase heading used above each section (e.g. "DESCRIPTION", "PRICING")
// Renders a little square dot + label + a line that fills the rest of the row.
function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          background: OXBLOOD,
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: STONE,
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: HAIRLINE }} />
    </div>
  );
}

// A single "label ---- value" row, used in the Seller/Record tabs to list raw fields.
// Pass mono=true to render the value in monospace (good for IDs/technical values).
function FieldRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "9px 0",
        fontSize: 13,
        borderTop: `1px solid ${HAIRLINE}`,
      }}
    >
      <span style={{ color: STONE }}>{label}</span>
      <span
        style={{
          fontWeight: mono ? 400 : 500,
          fontFamily: mono ? MONO : SANS,
          fontSize: mono ? 12.5 : 13,
          textAlign: "right",
          maxWidth: "62%",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------
// MAIN PAGE COMPONENT
// ---------------------------------------------------------
export default function ProductAdminView() {
  const [tab, setTab] = useState("overview"); // which tab is currently active
  const [activeImg, setActiveImg] = useState(0); // which gallery image is currently shown
  const [confirmDelete, setConfirmDelete] = useState(false); // whether the delete confirm popup is open

  const inStock = product.stock > 0; // true/false used for the stamp badge
  const savings = product.mrp - product.offerPrice; // rupee amount saved vs MRP

  // Tab definitions — add/remove entries here to change what tabs show up
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing & stock" },
    { id: "seller", label: "Seller & category" },
    { id: "record", label: "Record" },
  ];

  return (
    <div
      style={{
        fontFamily: SANS,
        color: INK,
        background: "#ffffff",
        minHeight: "100vh",
        padding: "32px 40px 64px",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        table { border-collapse: collapse; width: 100%; }
        .row-hover:hover { background: ${PAPER_TINT}; } /* highlights table rows on hover */
      `}</style>

      {/* ===================== TOP BAR: breadcrumb + action buttons ===================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Breadcrumb trail: Products / Category / Product name */}
        <div
          style={{
            fontSize: 13,
            color: STONE,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>Products</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span>{product.category.name}</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: INK, fontWeight: 500 }}>
            {product.productName}
          </span>
        </div>

        {/* Admin action buttons.
            NOTE: no "Edit product" button here on purpose — since sellers own their
            own listings, admin gets moderation actions instead of direct editing. */}
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            style={{
              border: `1px solid ${HAIRLINE}`,
              background: "#fff",
              color: INK,
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Duplicate
          </Button>
          <button
            style={{
              border: `1px solid ${HAIRLINE}`,
              background: "#fff",
              color: AMBER,
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Flag for review
          </button>
          <button
            style={{
              border: `1px solid ${HAIRLINE}`,
              background: "#fff",
              color: OXBLOOD,
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Suspend listing
          </button>

          {/* Delete button: clicking it toggles a small confirm popup instead of deleting instantly */}
          <button
            onMouseLeave={() => setConfirmDelete(false)} // closes the popup if the mouse leaves the button area
            onClick={() => setConfirmDelete((v) => !v)}
            style={{
              position: "relative",
              border: `1px solid ${OXBLOOD}`,
              background: OXBLOOD,
              color: "#fff",
              borderRadius: 6,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Delete product
            {/* Confirm/Cancel popup — only rendered when confirmDelete is true */}
            {confirmDelete && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "#fff",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 8,
                  padding: 12,
                  width: 220,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  textAlign: "left",
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 12.5,
                    color: INK,
                    marginBottom: 10,
                    fontWeight: 500,
                  }}
                >
                  Permanently delete this listing? This can't be undone.
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {/* Hook this up to your actual delete API call */}
                  <button
                    style={{
                      flex: 1,
                      border: `1px solid ${OXBLOOD}`,
                      background: OXBLOOD,
                      color: "#fff",
                      borderRadius: 6,
                      padding: "6px 0",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      flex: 1,
                      border: `1px solid ${HAIRLINE}`,
                      background: "#fff",
                      color: INK,
                      borderRadius: 6,
                      padding: "6px 0",
                      fontSize: 12.5,
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ===================== MAIN PANEL (image + details side by side) ===================== */}
      <div
        style={{
          display: "flex",
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Thin colored bar down the left edge — purely decorative "ledger spine" accent */}
        <div style={{ width: 5, background: OXBLOOD, flexShrink: 0 }} />

        <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
          {/* ---------- LEFT COLUMN: image gallery + attributes ---------- */}
          <div
            style={{
              width: "36%",
              padding: 28,
              borderRight: `1px solid ${HAIRLINE}`,
            }}
          >
            {/* Main large image — shows whichever thumbnail is currently selected (activeImg) */}
            <div
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 10,
                overflow: "hidden",
                background: PAPER_TINT,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <img
                src={product.productImage[activeImg].url}
                alt={product.productName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Thumbnail strip — loops over ALL images in productImage, however many there are */}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {product.productImage.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImg(i)} // clicking a thumbnail swaps the main image
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 6,
                    overflow: "hidden",
                    padding: 0,
                    border:
                      i === activeImg
                        ? `2px solid ${OXBLOOD}`
                        : `1px solid ${HAIRLINE}`,
                    background: "none",
                  }}
                >
                  <img
                    src={img.url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Shows total image count + the publicId of whichever image is active (useful for admins matching to storage) */}
            <div
              style={{
                fontSize: 11,
                color: STONE,
                marginTop: 8,
                fontFamily: MONO,
              }}
            >
              {product.productImage.length} images &middot;{" "}
              {product.productImage[activeImg].publicId}
            </div>

            {/* Quick-glance attributes: brand, category, coupon */}
            <div style={{ marginTop: 24 }}>
              <SectionLabel>Attributes</SectionLabel>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  fontSize: 13,
                }}
              >
                <span style={{ color: STONE }}>Brand</span>
                <span style={{ fontWeight: 500 }}>{product.brand}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  fontSize: 13,
                }}
              >
                <span style={{ color: STONE }}>Category</span>
                <span style={{ fontWeight: 500 }}>{product.category.name}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  fontSize: 13,
                }}
              >
                <span style={{ color: STONE }}>Coupon</span>
                <span style={{ fontWeight: 500 }}>
                  {product.couponId ? product.couponId : "None applied"}
                </span>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT COLUMN: title, price, tabs, tab content ---------- */}
          <div style={{ flex: 1, padding: 28, minWidth: 0 }}>
            {/* Title row + status stamp badge */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 26,
                    margin: 0,
                    color: INK,
                  }}
                >
                  {product.productName}
                </h1>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: STONE,
                    marginTop: 6,
                  }}
                >
                  {product.id}
                </div>
              </div>

              {/* Circular "stamp" badge — flips between In stock / Sold out based on product.stock */}
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  border: `2px solid ${inStock ? OXBLOOD : STONE}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(-6deg)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: inStock ? OXBLOOD : STONE,
                    textTransform: "uppercase",
                  }}
                >
                  {inStock ? "In stock" : "Sold out"}
                </span>
              </div>
            </div>

            {/* Price row: offer price, crossed-out MRP, discount badge */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginTop: 18,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 500 }}>
                {currency(product.offerPrice)}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  color: STONE,
                  textDecoration: "line-through",
                }}
              >
                {currency(product.mrp)}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: SUCCESS,
                  background: SUCCESS_BG,
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
              >
                {product.offerPercentage}% off
              </span>
            </div>

            {/* Tab bar — clicking a tab updates the "tab" state, which controls what renders below */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginTop: 26,
                borderBottom: `1px solid ${HAIRLINE}`,
                flexWrap: "wrap",
              }}
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: tab === t.id ? OXBLOOD : STONE,
                    borderBottom:
                      tab === t.id
                        ? `2px solid ${OXBLOOD}`
                        : "2px solid transparent",
                    marginBottom: -1,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ---------- TAB CONTENT: only one block renders at a time, based on "tab" ---------- */}
            <div style={{ paddingTop: 22 }}>
              {/* --- OVERVIEW TAB: description + quick stats --- */}
              {tab === "overview" && (
                <div>
                  <SectionLabel>Description</SectionLabel>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: INK,
                      margin: "0 0 22px",
                    }}
                  >
                    {product.productDesc}
                  </p>
                  <SectionLabel>Snapshot</SectionLabel>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 12,
                    }}
                  >
                    {/* Three quick stat cards — stock left, units ordered, and rupees saved */}
                    {[
                      ["In stock", product.stock],
                      ["Units ordered", product.ordered],
                      ["You save", currency(savings)],
                    ].map(([label, val]) => (
                      <div
                        key={label}
                        style={{
                          background: PAPER_TINT,
                          borderRadius: 8,
                          padding: "14px 16px",
                        }}
                      >
                        <div style={{ fontSize: 12, color: STONE }}>
                          {label}
                        </div>
                        <div
                          style={{
                            fontFamily: MONO,
                            fontSize: 20,
                            fontWeight: 500,
                            marginTop: 4,
                          }}
                        >
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- PRICING & STOCK TAB: MRP/offer/discount table + stock bar --- */}
              {tab === "pricing" && (
                <div>
                  <SectionLabel>Pricing</SectionLabel>
                  <table>
                    <tbody>
                      <tr
                        style={{ borderTop: `1px solid ${HAIRLINE}` }}
                        className="row-hover"
                      >
                        <td
                          style={{
                            padding: "10px 8px",
                            fontSize: 13,
                            color: STONE,
                          }}
                        >
                          MRP
                        </td>
                        <td
                          style={{
                            padding: "10px 8px",
                            fontSize: 13,
                            fontFamily: MONO,
                            textAlign: "right",
                          }}
                        >
                          {currency(product.mrp)}
                        </td>
                      </tr>
                      <tr
                        style={{ borderTop: `1px solid ${HAIRLINE}` }}
                        className="row-hover"
                      >
                        <td
                          style={{
                            padding: "10px 8px",
                            fontSize: 13,
                            color: STONE,
                          }}
                        >
                          Offer price
                        </td>
                        <td
                          style={{
                            padding: "10px 8px",
                            fontSize: 13,
                            fontFamily: MONO,
                            textAlign: "right",
                            fontWeight: 500,
                          }}
                        >
                          {currency(product.offerPrice)}
                        </td>
                      </tr>
                      <tr
                        style={{ borderTop: `1px solid ${HAIRLINE}` }}
                        className="row-hover"
                      >
                        <td
                          style={{
                            padding: "10px 8px",
                            fontSize: 13,
                            color: STONE,
                          }}
                        >
                          Discount
                        </td>
                        <td style={{ padding: "10px 8px", textAlign: "right" }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              padding: "3px 8px",
                              borderRadius: 4,
                              background: SUCCESS_BG,
                              color: SUCCESS,
                            }}
                          >
                            {product.offerPercentage}%
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ marginTop: 24 }}>
                    <SectionLabel>Stock</SectionLabel>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 8px",
                      }}
                    >
                      <span style={{ fontSize: 13, color: STONE }}>
                        Available units
                      </span>
                      <StockBar stock={product.stock} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 8px",
                        borderTop: `1px solid ${HAIRLINE}`,
                      }}
                    >
                      <span style={{ fontSize: 13, color: STONE }}>
                        Units ordered
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 13 }}>
                        {product.ordered}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SELLER & CATEGORY TAB --- */}
              {tab === "seller" && (
                <div>
                  <SectionLabel>Seller</SectionLabel>
                  {/* Seller avatar (just first letter of name in a circle), name, rating, listing count */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: PAPER_TINT,
                        border: `1px solid ${HAIRLINE}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: 14,
                        color: OXBLOOD,
                      }}
                    >
                      {product.seller.name.slice(0, 1)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {product.seller.name}
                      </div>
                      <div style={{ fontSize: 12, color: STONE }}>
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

                  <div style={{ marginTop: 24 }}>
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

              {/* --- RECORD TAB: raw database fields, for debugging/admin reference --- */}
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
