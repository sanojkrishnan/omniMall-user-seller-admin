import { useState } from "react";
import {
  Briefcase,
  Check,
  CreditCard,
  Home,
  Landmark,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
  Banknote,
  Tag,
  Truck,
  Zap,
  X,
  Wallet,
} from "lucide-react";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import { FormCard } from "./ui/FormCard";

/* ---------- static data ---------- */
const ADDRESSES = [
  {
    _id: "a1",
    label: "home",
    name: "Sanoj Krishnan M",
    phone: "+916238883964",
    line1: "Marankavalappil house, Arayi, Kanhangad South PO",
    line2: "erathumundya temple",
    city: "Kanhangad",
    state: "Kerala",
    pincode: "671531",
    isDefault: true,
  },
  {
    _id: "a2",
    label: "work",
    name: "Sanoj Krishnan M",
    phone: "+916238883964",
    line1: "Kanhangad Town, Near Bus Stand",
    line2: "",
    city: "Kanhangad",
    state: "Kerala",
    pincode: "671315",
    isDefault: false,
  },
];

const ITEMS = [
  {
    _id: "p1",
    name: "Wireless Noise Cancelling Headphones",
    seller: "SoundHub Store",
    variant: "Black",
    price: 2499,
    mrp: 3999,
    qty: 1,
    image: "https://placehold.co/120x120/000000/ffffff?text=Item+1",
  },
  {
    _id: "p2",
    name: "Cotton Casual Shirt",
    seller: "Urban Threads",
    variant: "Size M · Blue",
    price: 799,
    mrp: 1299,
    qty: 2,
    image: "https://placehold.co/120x120/000000/ffffff?text=Item+2",
  },
];

const DELIVERY_OPTIONS = [
  {
    id: "standard",
    label: "Standard delivery",
    eta: "4–6 days",
    fee: 49,
    icon: Truck,
  },
  {
    id: "express",
    label: "Express delivery",
    eta: "1–2 days",
    fee: 129,
    icon: Zap,
  },
];

const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FLAT200: { type: "flat", value: 200, label: "₹200 off" },
};

const PAYMENTS = [
  {
    id: "upi",
    label: "UPI",
    hint: "Google Pay, PhonePe, Paytm",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Credit / Debit card",
    hint: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    label: "Net banking",
    hint: "All major banks",
    icon: Landmark,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when it arrives (+₹30 fee)",
    icon: Banknote,
  },
  {
    id: "wallet",
    label: "Wallet",
    hint: "Supported wallets",
    icon: Wallet,
  },
];

const FREE_DELIVERY_ABOVE = 999;
const COD_FEE = 30;
const GST_RATE = 0.18;
const labelIcons = { home: Home, work: Briefcase, other: MapPin };
const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

/* ---------- small pieces ---------- */
function Section({ step, title, children }) {
  return (
    <section className="rounded-2xl border border-black/15 bg-white p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-bold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-xs text-white">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Radio({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-black bg-black/[0.03]"
          : "border-black/15 hover:border-black/60"
      }`}
    >
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
          selected ? "border-black bg-black text-white" : "border-black/40"
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </button>
  );
}

const inputCls =
  "w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-black";

/* ---------- page ---------- */
export default function PlaceOrder() {
  const [addressId, setAddressId] = useState(
    ADDRESSES.find((a) => a.isDefault)?._id,
  );
  const [items, setItems] = useState(ITEMS);
  const [deliveryId, setDeliveryId] = useState("standard");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null); // { code, ...COUPONS[code] }
  const [couponError, setCouponError] = useState("");
  const [paymentId, setPaymentId] = useState("upi");
  const [note, setNote] = useState("");

  const address = ADDRESSES.find((a) => a._id === addressId);
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId);

  function changeQty(id, diff) {
    setItems((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, qty: Math.min(10, Math.max(1, i.qty + diff)) }
          : i,
      ),
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setCoupon({ code, ...COUPONS[code] });
      setCouponError("");
      setCouponInput("");
    } else {
      setCoupon(null);
      setCouponError("Invalid coupon code");
    }
  }

  /* ---------- totals ---------- */
  const mrpTotal = items.reduce((s, i) => s + i.mrp * i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const productDiscount = mrpTotal - subtotal;
  const couponDiscount = coupon
    ? coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
    : 0;
  const deliveryFee =
    deliveryId === "standard" && subtotal >= FREE_DELIVERY_ABOVE
      ? 0
      : delivery.fee;
  const codFee = paymentId === "cod" ? COD_FEE : 0;
  const total = subtotal - couponDiscount + deliveryFee + codFee;
  const gstIncluded = Math.round(
    ((subtotal - couponDiscount) * GST_RATE) / (1 + GST_RATE),
  );
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-1 sm:px-6">
        <BackButtonUser variant="secondary" />

        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Place order</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {itemCount} {itemCount === 1 ? "item" : "items"} · review and
            confirm
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* ---------- left column ---------- */}
          <div className="space-y-6">
            {/* 1. address */}
            <Section step={1} title="Delivery address">
              <div className="space-y-3">
                {ADDRESSES.map((a) => {
                  const Icon = labelIcons[a.label] ?? MapPin;
                  return (
                    <Radio
                      key={a._id}
                      selected={addressId === a._id}
                      onClick={() => setAddressId(a._id)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-bold capitalize">{a.label}</span>
                        {a.isDefault && (
                          <span className="rounded-full bg-black px-2 py-0.5 text-[11px] font-semibold text-white">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-semibold">{a.name}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">
                        {a.line1}
                        {a.line2 && `, ${a.line2}`}
                        <br />
                        {a.city}, {a.state} {a.pincode}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
                        <Phone className="h-3.5 w-3.5" /> {a.phone}
                      </p>
                    </Radio>
                  );
                })}
              </div>
            </Section>

            {/* 2. items */}
            <Section step={2} title="Review items">
              {items.length === 0 ? (
                <p className="py-6 text-center text-sm text-neutral-500">
                  Your order is empty.
                </p>
              ) : (
                <div className="divide-y divide-black/10">
                  {items.map((i) => (
                    <div
                      key={i._id}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <img
                        src={i.image}
                        alt={i.name}
                        className="h-20 w-20 shrink-0 rounded-xl border border-black/15 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold leading-snug">
                              {i.name}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-500">
                              {i.variant} · Sold by {i.seller}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(i._id)}
                            className="text-neutral-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center rounded-full border border-black/20">
                            <button
                              onClick={() => changeQty(i._id, -1)}
                              className="grid h-8 w-8 place-items-center hover:opacity-60"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {i.qty}
                            </span>
                            <button
                              onClick={() => changeQty(i._id, 1)}
                              className="grid h-8 w-8 place-items-center hover:opacity-60"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">
                              {inr(i.price * i.qty)}
                            </span>
                            <span className="ml-2 text-xs text-neutral-400 line-through">
                              {inr(i.mrp * i.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* 3. delivery */}
            <Section step={3} title="Delivery option">
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((d) => {
                  const free =
                    d.id === "standard" && subtotal >= FREE_DELIVERY_ABOVE;
                  return (
                    <Radio
                      key={d.id}
                      selected={deliveryId === d.id}
                      onClick={() => setDeliveryId(d.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <d.icon className="h-4 w-4" />
                          <span className="font-semibold">{d.label}</span>
                        </div>
                        <span className="text-sm font-bold">
                          {free ? "FREE" : inr(d.fee)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Arrives in {d.eta}
                        {d.id === "standard" &&
                          ` · free above ${inr(FREE_DELIVERY_ABOVE)}`}
                      </p>
                    </Radio>
                  );
                })}
              </div>
            </Section>

            {/* 4. payment */}
            <Section step={4} title="Payment method">
              <div className="space-y-3">
                {PAYMENTS.map((p) => (
                  <Radio
                    key={p.id}
                    selected={paymentId === p.id}
                    onClick={() => setPaymentId(p.id)}
                  >
                    <div className="flex items-center gap-2">
                      <p.icon className="h-4 w-4" />
                      <span className="font-semibold">{p.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{p.hint}</p>

                    {paymentId === p.id && p.id === "upi" && (
                      <input
                        className={`${inputCls} mt-3`}
                        placeholder="yourname@upi"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}

                    {paymentId === p.id && p.id === "card" && (
                      <div
                        className="mt-3 grid grid-cols-2 gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          className={`${inputCls} col-span-2`}
                          placeholder="Card number"
                          inputMode="numeric"
                        />
                        <input
                          className={`${inputCls} col-span-2`}
                          placeholder="Name on card"
                        />
                        <input className={inputCls} placeholder="MM / YY" />
                        <input
                          className={inputCls}
                          placeholder="CVV"
                          type="password"
                        />
                      </div>
                    )}
                  </Radio>
                ))}
              </div>
            </Section>

            {/* 5. note */}
            <Section step={5} title="Order note (optional)">
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Delivery instructions, gift message..."
                className={inputCls}
              />
            </Section>
          </div>

          {/* ---------- right column: summary ---------- */}
          <FormCard className=" space-y-3 lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Package className="h-5 w-5" /> Order summary
            </h2>

            {/* coupon */}
            <div>
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl border border-black bg-black/[0.03] px-3 py-2.5 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    <Tag className="h-4 w-4" /> {coupon.code}
                    <span className="font-normal text-neutral-500">
                      ({coupon.label})
                    </span>
                  </span>
                  <button
                    onClick={() => setCoupon(null)}
                    className="text-xs underline underline-offset-4 hover:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      placeholder="Coupon code (try SAVE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <Button className="w-fit" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="mt-1.5 text-xs text-red-500">{couponError}</p>
                  )}
                </>
              )}
            </div>

            {/* price breakdown */}
            <dl className="space-y-2 border-t border-black/10 pt-4 text-sm">
              <Row label={`Price (${itemCount} items)`} value={inr(mrpTotal)} />
              <Row
                label="Product discount"
                value={`− ${inr(productDiscount)}`}
                green
              />
              {couponDiscount > 0 && (
                <Row
                  label={`Coupon (${coupon.code})`}
                  value={`− ${inr(couponDiscount)}`}
                  green
                />
              )}
              <Row
                label="Delivery fee"
                value={deliveryFee === 0 ? "FREE" : inr(deliveryFee)}
                green={deliveryFee === 0}
              />
              {codFee > 0 && (
                <Row label="Cash on delivery fee" value={inr(codFee)} />
              )}
              <div className="flex items-center justify-between border-t border-black pt-3 text-base font-bold">
                <dt>Total amount</dt>
                <dd>{inr(total)}</dd>
              </div>
              <p className="text-xs text-neutral-500">
                Includes GST of {inr(gstIncluded)}
              </p>
              {productDiscount + couponDiscount > 0 && (
                <p className="rounded-lg bg-black/[0.04] px-3 py-2 text-xs font-semibold">
                  You save {inr(productDiscount + couponDiscount)} on this order
                </p>
              )}
            </dl>

            {/* deliver-to recap */}
            {address && (
              <div className="border-t border-black/10 pt-4 text-xs text-neutral-600">
                <p className="font-semibold text-black">Delivering to</p>
                <p className="mt-1 leading-relaxed">
                  {address.name}, {address.line1}, {address.city}{" "}
                  {address.pincode}
                </p>
                <p className="mt-1">
                  {delivery.label} · {delivery.eta}
                </p>
              </div>
            )}

            <Button
              className="w-full"
              disabled={items.length === 0 || !address}
              onClick={() => alert("Static demo: order placed")}
            >
              {paymentId === "cod" ? "Place order" : `Pay ${inr(total)}`}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout · Easy
              7-day returns
            </p>
          </FormCard>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, green }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-neutral-600">{label}</dt>
      <dd className={green ? "font-semibold text-green-600" : "font-semibold"}>
        {value}
      </dd>
    </div>
  );
}
