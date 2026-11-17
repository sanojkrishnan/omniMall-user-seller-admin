import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BackButtonUser from "./ui/BackButtonUser";
import { clearSellerError, fetchAllAddress } from "../redux/slice/addressSlice";
import {
  clearProductError,
  singleProductFetch,
} from "../redux/slice/productSlice";
import {
  COD_FEE,
  COUPONS,
  DELIVERY_OPTIONS,
  FREE_DELIVERY_ABOVE,
  GST_RATE,
  inputCls,
  PAYMENTS,
} from "./ui/Constant";
import ItemsSection from "./ui/ItemsSection";
import NoteSection from "./ui/NoteSection";
import OrderSummary from "./ui/OrderSummary";
import { useNavigate } from "react-router-dom";
import AddressCard from "./ui/AddressCard";
import Section from "./ui/Section";
import Radio from "./ui/Radio";
// import DeliverySection from "./ui/DeliverySection";
import usePayment from "../hooks/usePayment";

function PaymentSection({ step, paymentId, onChange }) {
  return (
    <Section step={step} title="Payment method">
      <div className="space-y-3">
        {PAYMENTS.map((p) => (
          <Radio
            key={p.id}
            selected={paymentId === p.id}
            onClick={() => onChange(p.id)}
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
                <input className={inputCls} placeholder="CVV" type="password" />
              </div>
            )}
          </Radio>
        ))}
      </div>
    </Section>
  );
}

function AddressSection({
  step,
  addresses,
  selectedId,
  onSelect,
  loading,
  error,
}) {
  const navigate = useNavigate();

  return (
    <Section step={step} title="Delivery address">
      {loading && (
        <p className="text-sm text-neutral-500">Loading addresses...</p>
      )}
      {error && (
        <p className="text-sm text-red-500">
          {typeof error === "string" ? error : "Could not load addresses"}
        </p>
      )}
      {!loading && addresses.length === 0 && (
        <p className="text-sm text-neutral-500">
          No saved address. Add one to continue.
        </p>
      )}

      <div className="space-y-3">
        {addresses.map((a) => (
          <div
            key={a._id}
            onClick={() => onSelect(a._id)}
            className={`cursor-pointer rounded-2xl ${
              selectedId === a._id ? "ring-2 ring-black" : ""
            }`}
          >
            <AddressCard order address={a} />
          </div>
        ))}
      </div>

      <div className="flex w-full items-end">
        <button
          type="button"
          onClick={() => navigate("/user/profile/addresses")}
          className="ml-auto mt-4 text-xs font-semibold underline underline-offset-4 hover:opacity-60"
        >
          Edit address
        </button>
      </div>
    </Section>
  );
}

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [deliveryId, setDeliveryId] = useState("standard");
  const [paymentId, setPaymentId] = useState("upi");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null); // { code, ...COUPONS[code] }
  const [couponError, setCouponError] = useState("");
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [addressId, setAddressId] = useState(null);
  const { pay, isProcessing } = usePayment();

  const {
    address = [],
    isAddressLoading,
    addressError,
  } = useSelector((state) => state.address);
  const { singleProduct, isProductLoading, productError } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    dispatch(fetchAllAddress());
    return () => {
      dispatch(clearSellerError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(singleProductFetch({ id }));
    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch, id]);

  const sortedAddresses = [...address].sort(
    (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0),
  );
  const selectedAddress =
    address.find((a) => a._id === addressId) ||
    address.find((a) => a.isDefault) ||
    address[0] ||
    null;

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId);

  function changeQty(diff) {
    setQty((q) => Math.min(10, Math.max(1, q + diff)));
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

  async function handlePlace() {
    const result = await pay({
      methodId: paymentId,
      payload: {
        productId: singleProduct._id,
        qty,
        addressId: selectedAddress._id,
        deliveryId,
        couponCode: coupon?.code,
        note,
      },
    });
    if (result.ok)
      navigate(`/user/orders/${result.orderId}`); // your success page
    else if (!result.cancelled) alert(result.message); // swap for your toast
  }

  /* ---------- totals ---------- */
  const mrpTotal = (singleProduct?.mrp ?? 0) * qty;
  const subtotal = (singleProduct?.offerPrice ?? 0) * qty;
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

  const totals = {
    itemCount: singleProduct ? qty : 0,
    mrpTotal,
    productDiscount: mrpTotal - subtotal,
    couponDiscount,
    deliveryFee,
    codFee,
    total: subtotal - couponDiscount + deliveryFee + codFee,
    gstIncluded: Math.round(
      ((subtotal - couponDiscount) * GST_RATE) / (1 + GST_RATE),
    ),
  };

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-1 sm:px-6">
        <BackButtonUser variant="secondary" />

        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Place order</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} ·
            review and confirm
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <ItemsSection
              step={2}
              product={singleProduct}
              qty={qty}
              loading={isProductLoading}
              error={productError}
              onChangeQty={changeQty}
            />
            <AddressSection
              step={1}
              addresses={sortedAddresses}
              selectedId={selectedAddress?._id}
              onSelect={setAddressId}
              loading={isAddressLoading}
              error={addressError}
            />

            {/* <DeliverySection
              step={3}
              deliveryId={deliveryId}
              onChange={setDeliveryId}
              subtotal={subtotal}
            /> */}
            <PaymentSection
              step={4}
              paymentId={paymentId}
              onChange={setPaymentId}
            />
            <NoteSection step={5} note={note} onChange={setNote} />
          </div>

          <OrderSummary
            totals={totals}
            coupon={coupon}
            couponProps={{
              input: couponInput,
              error: couponError,
              onInputChange: setCouponInput,
              onApply: applyCoupon,
              onRemove: () => setCoupon(null),
            }}
            delivery={delivery}
            paymentId={paymentId}
            selectedAddress={selectedAddress}
            canPlace={!!singleProduct && !!selectedAddress && !isProcessing}
            onPlace={handlePlace}
          />
        </div>
      </main>
    </div>
  );
}
