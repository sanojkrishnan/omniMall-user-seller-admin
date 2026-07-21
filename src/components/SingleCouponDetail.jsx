import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Tag,
  Percent,
  CalendarClock,
  Users,
  CreditCard,
  Layers,
  Zap,
  ShoppingBag,
  Ban,
  Store,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/Button";
import { fetchCouponById } from "../redux/slice/couponSlice";
import CartLoading from "./ui/CartLoading";
import ToggleSwitch from "./ui/ToggleSwitch";
import P from "./ui/P";
import { useDateFormatter } from "../hooks/useDateFormatter";
import { Pill, Row, Section, Stat } from "./AdminCouponSupport";

// ---- label maps: keep raw enum values out of the UI ----
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const DISCOUNT_TYPE_LABELS = {
  percentage: "Percentage off",
  flat: "Flat amount off",
};

const ELIGIBLE_USERS_LABELS = {
  all: "All users",
  new: "New users only",
  existing: "Existing users only",
};

const PAYMENT_METHOD_LABELS = {
  COD: "Cash on delivery",
  CARD: "Card",
  UPI: "UPI",
};

function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}


function SingleCouponDetail() {

  const { couponId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

   const formatDate = useDateFormatter(); // formats dates into readable date values

  const { singleCoupon, isCouponLoading, couponError } = useSelector(
    (state) => state.coupon,
  );

  //toggle switch
  const handleSwitchChange = (status) => {
    console.log("The switch state is:", status); // true or false
  };

  useEffect(() => {
    if (couponId) dispatch(fetchCouponById(couponId));
  }, [dispatch, couponId]);

  if (isCouponLoading) {
    return (
      <div className="w-full h-screen py-24 flex items-center justify-center">
        <CartLoading />
      </div>
    );
  }

  if (couponError || !singleCoupon) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-gray-600 text-sm">This coupon couldn't be found.</p>
        <Button
          className="bg-[#5f0000] text-white px-4"
          onClick={() => navigate(-1)}
        >
          Back to coupons
        </Button>
      </div>
    );
  }

  const coupon = singleCoupon;
  const isPercentage = coupon.discountType === "percentage";
  const validityDays = daysBetween(coupon.startDate, coupon.endDate);
  const usedCount = coupon.usedCount ?? 0;
  const usagePct = coupon.usageLimit
    ? Math.min(100, Math.round((usedCount / coupon.usageLimit) * 100))
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#5f0000] mb-4 transition-colors"
      >
        <ArrowLeft size={15} />
        All coupons
      </button>

      {/* Header card — the coupon "ticket" */}
      <div className="relative rounded-xl overflow-hidden bg-[#5f0000] shadow-lg">
        <div className="px-6 pt-6 pb-8 sm:px-8 sm:pt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border bg-white/10 border-white/20 text-white`}
                >
                  {coupon.status?.toUpperCase() || "N/A"}
                </span>
                {coupon.autoApply && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white flex items-center gap-1">
                    <Zap size={10} /> Auto-applied
                  </span>
                )}
                {coupon.stackable && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white flex items-center gap-1">
                    <Layers size={10} /> Stackable
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white">
                {coupon.name || "Untitled coupon"}
              </h1>
              <p className="text-white/70 text-sm mt-1 max-w-md">
                {coupon.description || "No description provided."}
              </p>
            </div>
            <div>
              <Button
                className="bg-white w-fit text-[#5f0000] px-3 py-2 flex items-center gap-1.5 shrink-0 hover:bg-white/90"
                onClick={() => navigate(`/admin/coupons/${coupon._id}/edit`)}
              >
                <Pencil size={14} />
              </Button>
              <Button
                className="bg-white w-fit text-[#5f0000] px-3 py-2 flex items-center gap-1.5 shrink-0 hover:bg-white/90"
                onClick={() => navigate(`/admin/coupons/${coupon._id}/edit`)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>

          {/* Coupon code — the signature element */}
          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 border border-dashed border-white/30 rounded-lg px-4 py-2">
            <Tag size={16} className="text-white/70" />
            <span className="font-mono text-lg tracking-[0.15em] text-white">
              {coupon.code || "N/A"}
            </span>
          </div>
          <div className="mt-6 flex justify-start items-center">
            <P className={"text-white mr-4 pt-0 text-md"}>Activate coupon :</P>
            <ToggleSwitch initialState={false} onChange={handleSwitchChange} />
          </div>
        </div>

        {/* Perforated divider, like a ticket stub */}
        <div className="relative h-px bg-white/15">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-white/0" />
            ))}
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-5 sm:px-8 bg-black/10">
          <Stat
            label="Discount"
            value={
              isPercentage
                ? `${coupon.discountValue ?? "—"}%`
                : `₹${coupon.discountValue ?? "—"}`
            }
          />
          <Stat label="Min. order" value={`₹${coupon.minOrderAmount ?? "—"}`} />
          <Stat
            label="Valid for"
            value={`${validityDays} day${validityDays === 1 ? "" : "s"}`}
          />
          <Stat
            label="Redeemed"
            value={`${usedCount}/${coupon.usageLimit ?? "—"}`}
          />
        </div>
      </div>

      {/* Body grid */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Section icon={Percent} title="Discount rules">
          <Row
            label="Type"
            value={DISCOUNT_TYPE_LABELS[coupon.discountType] || "N/A"}
          />
          <Row
            label="Value"
            value={
              isPercentage
                ? `${coupon.discountValue ?? "—"}%`
                : `₹${coupon.discountValue ?? "—"}`
            }
          />
          {isPercentage && (
            <Row
              label="Capped at"
              value={
                coupon.maxDiscount != null ? `₹${coupon.maxDiscount}` : "No cap"
              }
            />
          )}
          <Row
            label="Minimum order"
            value={`₹${coupon.minOrderAmount ?? "—"}`}
          />
        </Section>

        <Section icon={CalendarClock} title="Validity">
          <Row label="Starts" value={formatDate(coupon.startDate)} />
          <Row label="Ends" value={formatDate(coupon.endDate)} />
          <Row label="Duration" value={`${validityDays} days`} />
        </Section>

        <Section icon={Users} title="Usage limits">
          <Row label="Total redemptions" value={coupon.usageLimit ?? "—"} />
          <Row label="Per user" value={coupon.usagePerUser ?? "—"} />
          <Row
            label="Eligible users"
            value={ELIGIBLE_USERS_LABELS[coupon.eligibleUsers] || "N/A"}
          />
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Used</span>
              <span>{usagePct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-[#5f0000] rounded-full transition-all"
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        </Section>

        <Section icon={CreditCard} title="Payment methods">
          {Array.isArray(coupon.paymentMethods) &&
          coupon.paymentMethods.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {coupon.paymentMethods.map((method) => (
                <Pill key={method}>
                  {PAYMENT_METHOD_LABELS[method] || method}
                </Pill>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Valid on all payment methods.
            </p>
          )}
        </Section>

        <Section icon={ShoppingBag} title="Applicable to">
          <Row
            label="Products"
            value={coupon.applicableProducts?.length || "All products"}
          />
          <Row
            label="Categories"
            value={coupon.applicableCategories?.length || "All categories"}
          />
        </Section>

        <Section icon={Ban} title="Exclusions">
          <Row
            label="Excluded products"
            value={coupon.excludedProducts?.length || "None"}
          />
        </Section>

        {coupon.sellerIds?.length > 0 && (
          <Section icon={Store} title="Restricted to sellers">
            <p className="text-sm text-gray-600">
              {coupon.sellerIds.length} seller
              {coupon.sellerIds.length === 1 ? "" : "s"} opted in
            </p>
          </Section>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Created {formatDate(coupon.createdAt)}
        {coupon.updatedAt && coupon.updatedAt !== coupon.createdAt
          ? ` · Last updated ${formatDate(coupon.updatedAt)}`
          : ""}
      </p>
    </div>
  );
}

export default SingleCouponDetail;
