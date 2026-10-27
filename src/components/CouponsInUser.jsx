import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupon } from "../redux/slice/couponSlice";
import CouponCard from "./CouponList";

/* ---------- helpers ---------- */
const getPhase = (c) => {
  const now = new Date();
  if (c.status === "inactive" || now > new Date(c.endDate)) return "expired";
  if (c.status === "pending" || now < new Date(c.startDate)) return "upcoming";
  return "active";
};

// ids or populated docs both work
const label = (list = [], singular) => {
  const names = list.map((x) => x?.name).filter(Boolean);
  if (names.length) {
    const shown = names.slice(0, 2).join(", ");
    return names.length > 2 ? `${shown} +${names.length - 2}` : shown;
  }
  return `${list.length} ${singular}${list.length > 1 ? "s" : ""}`;
};

const TABS = [
  { id: "active", text: "Active" },
  { id: "upcoming", text: "Upcoming" },
  { id: "expired", text: "Expired" },
];
const AUDIENCE = [
  { id: "all", text: "All coupons" },
  { id: "everyone", text: "For everyone" },
  { id: "you", text: "Only for you" },
];
const SCOPE = [
  { id: "all", text: "Everything" },
  { id: "store", text: "Storewide" },
  { id: "product", text: "Product offers" },
  { id: "category", text: "Category offers" },
];

/* ---------- small UI ---------- */
function Chip({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-black"
      }`}
    >
      {children}
      <span
        className={`ml-2 text-xs ${active ? "text-white/70" : "text-gray-400"}`}
      >
        {count}
      </span>
    </button>
  );
}

function Tag({ tone, children }) {
  const tones = {
    you: "bg-black text-white",
    locked: "bg-gray-200 text-gray-600",
    product: "bg-blue-50 text-blue-800 ring-1 ring-blue-200",
    category: "bg-violet-50 text-violet-800 ring-1 ring-violet-200",
    store: "bg-white text-gray-700 ring-1 ring-gray-300",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Tile({ entry, onApply }) {
  const { coupon: c, personal, hasProducts, hasCategories } = entry;
  const tags = [];
  if (personal) tags.push(["you", "Only for you"]);
  else if (c.eligibleUsers === "new") tags.push(["locked", "New users only"]);
  else if (c.eligibleUsers === "existing")
    tags.push(["locked", "Existing users only"]);
  if (hasProducts)
    tags.push([
      "product",
      `Products: ${label(c.applicableProducts, "product")}`,
    ]);
  if (hasCategories)
    tags.push([
      "category",
      `Categories: ${label(c.applicableCategories, "category")}`,
    ]);
  if (!hasProducts && !hasCategories) tags.push(["store", "Storewide"]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {tags.map(([tone, text]) => (
          <Tag key={text} tone={tone}>
            {text}
          </Tag>
        ))}
      </div>
      <CouponCard coupon={c} onApply={onApply} />
    </div>
  );
}

/* ---------- page ---------- */
export default function CouponsInUser({ userType, onApply }) {
  const dispatch = useDispatch();
  const {
    coupon: coupons = [],
    isCouponLoading: loading,
    couponError: error,
  } = useSelector((state) => state.coupon);

  // fetch every coupon (backend caps limit at 100) when the page opens
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchCoupon({ pagination: { page: 1, limit: 15 } }));
  }, [dispatch]);

  const [tab, setTab] = useState("active");
  const [audience, setAudience] = useState("all");
  const [scope, setScope] = useState("all");

  const entries = useMemo(
    () =>
      coupons.map((c) => ({
        coupon: c,
        phase: getPhase(c),
        personal:
          c.eligibleUsers !== "all" &&
          (!userType || c.eligibleUsers === userType),
        hasProducts: (c.applicableProducts?.length || 0) > 0,
        hasCategories: (c.applicableCategories?.length || 0) > 0,
      })),
    [coupons, userType],
  );

  const tabCount = (id) => entries.filter((e) => e.phase === id).length;
  const inTab = entries.filter((e) => e.phase === tab);

  const matchAudience = (e, id) =>
    id === "all" ||
    (id === "you" ? e.personal : e.coupon.eligibleUsers === "all");
  const matchScope = (e, id) =>
    id === "all" ||
    (id === "product" && e.hasProducts) ||
    (id === "category" && e.hasCategories) ||
    (id === "store" && !e.hasProducts && !e.hasCategories);

  const visible = inTab
    .filter((e) => matchAudience(e, audience) && matchScope(e, scope))
    .sort((a, b) => {
      if (a.personal !== b.personal) return a.personal ? -1 : 1; // personal first
      const diff = new Date(a.coupon.endDate) - new Date(b.coupon.endDate);
      return tab === "expired" ? -diff : diff; // soonest ending first, recent expiries first
    });

  const liveCount = tabCount("active");
  const forYouCount = entries.filter(
    (e) => e.phase === "active" && e.personal,
  ).length;

  return (
    <section className="w-full bg-gray-100">
      {/* hero */}
      <div
        className="px-4 py-14 text-center text-white sm:px-8 sm:py-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #2a2a3a 0%, #111118 50%, #0a0a0f 100%)",
        }}
      >
        <h1 className="text-3xl font-semibold sm:text-4xl">Coupons & Offers</h1>
        <p className="mt-2 text-white/70">
          Copy a code and apply it at checkout
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {[
            [liveCount, "live offers"],
            [forYouCount, "just for you"],
          ].map(([n, t]) => (
            <div
              key={t}
              className="min-w-[120px] rounded-2xl border border-white/15 bg-white/5 px-6 py-3"
            >
              <div className="text-3xl font-bold">{n}</div>
              <div className="text-xs text-white/60">{t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        {/* status tabs */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-gray-200 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  tab === t.id
                    ? "bg-black text-white shadow"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {t.text}{" "}
                <span className="ml-1 opacity-60">{tabCount(t.id)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* filters */}
        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {AUDIENCE.map((a) => (
              <Chip
                key={a.id}
                active={audience === a.id}
                onClick={() => setAudience(a.id)}
                count={inTab.filter((e) => matchAudience(e, a.id)).length}
              >
                {a.text}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SCOPE.map((s) => (
              <Chip
                key={s.id}
                active={scope === s.id}
                onClick={() => setScope(s.id)}
                count={inTab.filter((e) => matchScope(e, s.id)).length}
              >
                {s.text}
              </Chip>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="mt-10">
          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
              {typeof error === "string"
                ? error
                : "Could not load coupons. Please try again."}
            </div>
          )}

          {loading && (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[200px] animate-pulse rounded-2xl bg-gray-300"
                />
              ))}
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-14 text-center text-gray-500">
              No {tab} coupons match these filters.
            </div>
          )}

          {!loading && visible.length > 0 && (
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              }}
            >
              {visible.map((e) => (
                <Tile
                  key={e.coupon._id || e.coupon.code}
                  entry={e}
                  onApply={onApply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
