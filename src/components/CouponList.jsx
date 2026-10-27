import { useState } from "react";
import { Button } from "./ui/Button";
import { useCurrency } from "../hooks/useCurrency";
import { useNavigate } from "react-router-dom";

/* ---------- theme rules ----------
   Payment method  -> colour family (UPI violet, CARD blue, COD orange; 2 methods blend, all 3 = black)
   Offer size      -> surface: small = white, medium = tinted, big = solid gradient
   Usage per user  -> pips in the stub (one filled pip per allowed use)
----------------------------------- */
const METHOD_THEME = {
  UPI: { accent: "#6d28d9", deep: "#2e1065", tint: "#ede9fe" },
  CARD: { accent: "#0369a1", deep: "#082f49", tint: "#e0f2fe" },
  COD: { accent: "#c2410c", deep: "#431407", tint: "#ffedd5" },
};
const NEUTRAL = { accent: "#18181b", deep: "#000000", tint: "#f4f4f5" };

const getTheme = (methods = []) => {
  const list = [...new Set(methods)].filter((m) => METHOD_THEME[m]);
  if (list.length === 0 || list.length >= 3)
    return { ...NEUTRAL, accent2: NEUTRAL.accent, label: "Any payment" };
  const a = METHOD_THEME[list[0]];
  const b = METHOD_THEME[list[1]] || a;
  return {
    accent: a.accent,
    accent2: b.accent,
    deep: a.deep,
    tint: a.tint,
    label: list.join(" / "),
  };
};

const getTier = ({ discountType, discountValue, minOrderAmount }) => {
  const effective =
    discountType === "percentage"
      ? discountValue
      : minOrderAmount > 0
        ? (discountValue / minOrderAmount) * 100
        : 100;
  if (effective >= 40) return "high";
  if (effective >= 15) return "mid";
  return "low";
};

const getState = (c) => {
  const now = new Date();
  if (c.status === "inactive" || now > new Date(c.endDate))
    return { off: true, note: "Expired" };
  if (c.status === "pending" || now < new Date(c.startDate))
    return {
      off: true,
      note: `Starts ${new Date(c.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
    };
  const days = Math.ceil((new Date(c.endDate) - now) / 86400000);
  return {
    off: false,
    note:
      days <= 1
        ? "Ends today"
        : days <= 7
          ? `${days} days left`
          : `Till ${new Date(c.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
  };
};

function CouponSkeleton() {
  return (
    <div className="cp-wrap">
      <article className="cp cp-sk" aria-hidden="true">
        <div className="cp-sk-main">
          <i className="cp-sk-bar" style={{ width: "30%", height: 16 }} />
          <i
            className="cp-sk-bar"
            style={{ width: "55%", height: 40, marginTop: 18 }}
          />
          <i
            className="cp-sk-bar"
            style={{ width: "70%", height: 14, marginTop: 18 }}
          />
          <i
            className="cp-sk-bar"
            style={{ width: "40%", height: 12, marginTop: 14 }}
          />
        </div>
        <div className="cp-sk-stub">
          <i className="cp-sk-bar" style={{ width: "75%", height: 16 }} />
          <i
            className="cp-sk-bar"
            style={{ width: "85%", height: 30, borderRadius: 999 }}
          />
          <i className="cp-sk-bar" style={{ width: "60%", height: 10 }} />
        </div>
      </article>
    </div>
  );
}

export default function CouponCard({ coupon, onApply }) {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(coupon.paymentMethods);
  const tier = getTier(coupon);
  const state = getState(coupon);
  const isPercent = coupon.discountType === "percentage";
  const uses = coupon.usagePerUser || 1;
  const pips = Math.min(uses, 5);
  const inr = useCurrency();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch (e) {}
    setCopied(true);
    onApply?.(coupon);
    setTimeout(() => setCopied(false), 1600);
  };

  const methods = coupon.paymentMethods?.length
    ? coupon.paymentMethods
    : ["COD", "CARD", "UPI"];

  return (
    <div
      className={`cp-wrap ${state.off ? "is-off" : ""}`}
      style={{
        "--accent": theme.accent,
        "--accent2": theme.accent2,
        "--deep": theme.deep,
        "--tint": theme.tint,
      }}
    >
      <style>{css}</style>
      <article className={`cp tier-${tier}`}>
        <div className="cp-main">
          <div className="cp-chips">
            {coupon.eligibleUsers !== "all" && (
              <span className="cp-chip cp-chip-solid">
                {coupon.eligibleUsers === "new"
                  ? "New users"
                  : "Existing users"}
              </span>
            )}
          </div>

          <div className="cp-offer">
            <strong>
              {isPercent
                ? `${coupon.discountValue}%`
                : inr(coupon.discountValue)}
            </strong>
            <span>
              off
              {isPercent && coupon.maxDiscount
                ? ` up to ${inr(coupon.maxDiscount)}`
                : ""}
            </span>
          </div>

          <h3 className="cp-name">{coupon.name}</h3>

          <div className="cp-foot">
            <span className="cp-dot" />
            <span>{state.note}</span>
          </div>
        </div>

        <div className="cp-stub">
          <div className="cp-code font-orbitron">{coupon.code}</div>
          <Button
            className={"bg-black/30 font-mono"}
            onClick={copy}
            disabled={state.off}
          >
            {state.off ? state.note : copied ? "COPIED" : "COPY CODE"}
          </Button>
          <div
            className="cp-uses"
            title={`${uses} use${uses > 1 ? "s" : ""} per user`}
          >
            <div className="cp-pips">
              {Array.from({ length: pips }).map((_, i) => (
                <i key={i} />
              ))}
              {uses > 5 && <b>+</b>}
            </div>
            <span>
              {uses === 1 ? "One use per user" : `${uses} uses per user`}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

export function CouponList({ coupons = [], loading, error, onApply, feature }) {
  const navigate = useNavigate();
  const list = feature
    ? coupons
        .filter((c) => {
          const now = new Date();
          return (
            c.status === "active" &&
            now >= new Date(c.startDate) &&
            now <= new Date(c.endDate)
          );
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.startDate) -
            new Date(a.createdAt || a.startDate),
        )
        .slice(0, 3)
    : coupons;

  const showSkeleton = loading && !error && list.length === 0;

  const wrong = !loading && error && list.length === 0;

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      }}
    >
      <style>{css}</style>

      {showSkeleton &&
        Array.from({ length: 3 }).map((_, i) => <CouponSkeleton key={i} />)}

      {list.map((c) => (
        <CouponCard
          key={c._id || c.code}
          coupon={c}
          onApply={onApply}
          onClick={() => navigate(`/user/profile/coupon/${c._id}`)}
        />
      ))}
      {wrong && <span className="text-center">Something Went Wrong !</span>}
    </div>
  );
}

const css = `
.cp-wrap{--stub:140px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.14));max-width:520px;font-family:"Inter","Helvetica Neue",Arial,sans-serif}
.cp-wrap.is-off{filter:grayscale(1) opacity(.65) drop-shadow(0 4px 10px rgba(0,0,0,.1))}
.cp{display:flex;border-radius:18px;overflow:hidden;
  -webkit-mask:radial-gradient(circle 10px at calc(100% - var(--stub)) 0,#0000 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 10px at calc(100% - var(--stub)) 100%,#0000 98%,#000) bottom/100% 51% no-repeat;
  mask:radial-gradient(circle 10px at calc(100% - var(--stub)) 0,#0000 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 10px at calc(100% - var(--stub)) 100%,#0000 98%,#000) bottom/100% 51% no-repeat}

.cp-main{flex:1;min-width:0;padding:18px 18px 16px 20px;color:var(--deep)}
.tier-low .cp-main{background:#fff;color:#18181b}
.tier-low .cp-offer strong{color:var(--accent)}
.tier-mid .cp-main{background:var(--tint)}
.tier-mid .cp-offer strong{color:var(--accent)}
.tier-high .cp-main{color:#fff;background:radial-gradient(circle at 85% 0,rgba(255,255,255,.28),transparent 55%),linear-gradient(135deg,var(--accent),var(--accent2))}

.cp-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.cp-chip{font-size:11px;font-weight:600;padding:3px 9px;border-radius:999px;border:1px solid currentColor;opacity:.75}
.cp-chip-solid{background:var(--deep);color:#fff;border-color:transparent;opacity:1}
.tier-high .cp-chip-solid{background:#fff;color:var(--deep)}

.cp-offer{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.cp-offer strong{font-size:44px;line-height:1;font-weight:800;letter-spacing:-.04em}
.cp-offer span{font-size:14px;font-weight:600;opacity:.85}

.cp-name{margin:12px 0 2px;font-size:16px;font-weight:700}
.cp-desc{margin:0;font-size:13px;line-height:1.45;opacity:.8;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cp-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:14px;font-size:12px;font-weight:600;opacity:.85}
.cp-dot{width:3px;height:3px;border-radius:50%;background:currentColor}

.cp-stub{flex:0 0 var(--stub);background:var(--deep);color:#fff;border-left:2px dashed rgba(255,255,255,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:14px 10px;text-align:center}
.cp-code{font-size:15px;font-weight:800;letter-spacing:.08em;word-break:break-all}
.cp-btn{border:0;cursor:pointer;background:#fff;color:var(--deep);font:700 12px inherit;font-family:inherit;padding:8px 14px;border-radius:999px}
.cp-btn:disabled{cursor:not-allowed;opacity:.8}
.cp-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}
.cp-uses{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;opacity:.85}
.cp-pips{display:flex;gap:5px;align-items:center}
.cp-pips i{width:9px;height:9px;border-radius:50%;background:#fff}
.cp-pips b{font-size:12px}

.cp-sk{height:190px;background:#fff}
.cp-sk-main,.cp-sk-stub{position:relative;overflow:hidden}
.cp-sk-main{flex:1;padding:18px 20px;
  background:linear-gradient(90deg,#f3f4f6 25%,#ffffff 50%,#f3f4f6 75%);
  background-size:200% 100%;animation:cp-shimmer 1.4s linear infinite}
.cp-sk-stub{flex:0 0 var(--stub);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:14px 10px;
  border-left:2px dashed rgba(0,0,0,.15);
  background:linear-gradient(90deg,#d4d4d8 25%,#e9e9ec 50%,#d4d4d8 75%);
  background-size:200% 100%;animation:cp-shimmer 1.4s linear infinite}
.cp-sk-bar{display:block;border-radius:6px;background:rgba(0,0,0,.07)}
@keyframes cp-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
@media (prefers-reduced-motion:reduce){.cp-sk-main,.cp-sk-stub{animation:none}}

@media (max-width:420px){.cp-wrap{--stub:118px}.cp-offer strong{font-size:36px}}
`;
