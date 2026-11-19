import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ShieldCheck } from "lucide-react";
import {
  addOrder,
  clearOrderError,
  clearOrderState,
} from "../redux/slice/orderSlice";
import BackButtonUser from "./ui/BackButtonUser";
import ItemsSection from "./ui/ItemsSection";
import NoteSection from "./ui/NoteSection";
import OrderSummary from "./ui/OrderSummary";
import AddressCard from "./ui/AddressCard";
import Section from "./ui/Section";
import Radio from "./ui/Radio";
import {
  COD_FEE,
  COUPONS,
  DELIVERY_OPTIONS,
  FREE_DELIVERY_ABOVE,
  GST_RATE,
  PAYMENTS,
} from "./ui/Constant";
import { clearSellerError, fetchAllAddress } from "../redux/slice/addressSlice";
import {
  clearProductError,
  singleProductFetch,
} from "../redux/slice/productSlice";
import usePayment from "../hooks/usePayment";
import {
  placeOrderInitialValues,
  placeOrderSchema,
} from "../validation/placeOrderSchema";
import { useToastError } from "../hooks/useToastError.js";

/* ---------- payment ---------- */
// PAYMENTS ids must match the schema enum: card | upi | wallet | netBanking | cod
function PaymentSection({ step, value, onChange, error }) {
  const navigate = useNavigate();
  return (
    <Section step={step} title="Payment method">
      <div className="space-y-3">
        {PAYMENTS.map((p) => (
          <Radio
            key={p.id}
            selected={value === p.id}
            onClick={() => onChange(p.id)}
          >
            <div className="flex items-center gap-2">
              <p.icon className="h-4 w-4" />
              <span className="font-semibold">{p.label}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{p.hint}</p>
          </Radio>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

      <p className="mt-4 flex items-start gap-2 text-xs text-neutral-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        Card, UPI and wallet details are entered on the secure payment screen.
        We never see or store your card number or CVV.
      </p>

      <div className="flex w-full items-end">
        <button
          type="button"
          onClick={() => navigate("/user/profile/payments")}
          className="ml-auto mt-4 text-xs font-semibold underline underline-offset-4 hover:opacity-60"
        >
          Add payment options
        </button>
      </div>
    </Section>
  );
}

/* ---------- address ---------- */
function AddressSection({
  step,
  addresses,
  selectedId,
  onSelect,
  loading,
  formError,
}) {
  const navigate = useNavigate();

  return (
    <Section step={step} title="Delivery address">
      {loading && (
        <p className="text-sm text-neutral-500">Loading addresses...</p>
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

      {formError && <p className="mt-3 text-xs text-red-500">{formError}</p>}

      <div className="flex w-full items-end">
        <button
          type="button"
          onClick={() => navigate("/user/profile/addresses")}
          className="ml-auto mt-4 text-xs font-semibold underline underline-offset-4 hover:opacity-60"
        >
          {addresses.length === 0 ? "Add address" : "Edit address"}
        </button>
      </div>
    </Section>
  );
}

/* ---------- page ---------- */
export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pay, isProcessing } = usePayment();

  // coupon UI state (the server re-validates the code on submit)
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null); // { code, type, value }
  const [couponError, setCouponError] = useState("");

  const { isOrderLoading, orderError } = useSelector((state) => state.order);

  const {
    address = [],
    isAddressLoading,
    addressError,
  } = useSelector((state) => state.address);
  const { singleProduct, isProductLoading, productError } = useSelector(
    (state) => state.product,
  );

  /* ---------- form (matches placeOrderSchema) ---------- */
  const formik = useFormik({
    initialValues: placeOrderInitialValues, // { items, addressId, paymentMethod, couponCode, notes }
    validationSchema: placeOrderSchema,
    onSubmit: async (values) => {
      try {
        // create the order (the slice stores any failure in orderError)
        const res = await dispatch(addOrder({ values })).unwrap();
        const order = res.data;

        // COD is complete, so show the backend message and go to the order
        if (values.paymentMethod === "cod") {
          toast.success(res.message);
          navigate(`/user/orders/${order._id}`);
          return;
        }

        const result = await pay({ methodId: values.paymentMethod, order });
        if (result.ok) {
          toast.success(res.message);
          navigate(`/user/orders/${order._id}`);
        } else if (!result.cancelled) {
          toast.error(result.message); // message returned by usePayment / gateway
        }
        // if cancelled, the order stays "pending" and can be retried from My Orders
      } catch {
        // addOrder failure: orderError is set in the store and shown by
        // useToastError below, so there is nothing to show here
      }
    },
  });

  const { values, errors, setFieldValue } = formik;
  const quantity = values.items[0]?.quantity ?? 1;

  /* ---------- backend errors -> toasts ---------- */
  useToastError({
    errorMessage: !isAddressLoading ? addressError : null,
    fallbackErrorMessage: "Failed to load addresses",
  });

  useToastError({
    errorMessage: !isProductLoading ? productError : null,
    fallbackErrorMessage: "Failed to load the product",
  });

  useToastError({
    errorMessage: !isOrderLoading ? orderError : null,
    fallbackErrorMessage: "Failed to place the order",
  });

  /* ---------- load data ---------- */
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

  useEffect(() => {
    return () => {
      dispatch(clearOrderError());
      dispatch(clearOrderState());
    };
  }, [dispatch]);

  /* ---------- sync store data into the form ---------- */
  // product -> items
  useEffect(() => {
    if (singleProduct?._id) {
      setFieldValue("items", [
        { productId: singleProduct._id, quantity: 1, variant: {} },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProduct?._id]);

  // default address -> addressId
  const sortedAddresses = [...address].sort(
    (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0),
  );
  useEffect(() => {
    if (!values.addressId && sortedAddresses.length) {
      setFieldValue("addressId", sortedAddresses[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const selectedAddress =
    address.find((a) => a._id === values.addressId) || null;

  /* ---------- handlers ---------- */
  const changeQty = (diff) =>
    setFieldValue(
      "items.0.quantity",
      Math.min(10, Math.max(1, quantity + diff)),
    );

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setCoupon({ code, ...COUPONS[code] });
      setFieldValue("couponCode", code);
      setCouponError("");
      setCouponInput("");
    } else {
      setCoupon(null);
      setFieldValue("couponCode", "");
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setFieldValue("couponCode", "");
  };

  /* ---------- totals (display only, the server recalculates) ---------- */
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === "standard");
  const mrpTotal = (singleProduct?.mrp ?? 0) * quantity;
  const subtotal = (singleProduct?.offerPrice ?? 0) * quantity;
  const couponDiscount = coupon
    ? coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal)
    : 0;
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : delivery.fee;
  const codFee = values.paymentMethod === "cod" ? COD_FEE : 0;

  const totals = {
    itemCount: singleProduct ? quantity : 0,
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

  // show a schema error only after submit was tried
  const showErr = (msg) => (formik.submitCount > 0 ? msg : undefined);

  return (
    <div className="relative min-h-screen bg-white text-black">
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

        <form
          onSubmit={formik.handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            <AddressSection
              step={1}
              addresses={sortedAddresses}
              selectedId={values.addressId}
              onSelect={(aid) => setFieldValue("addressId", aid)}
              loading={isAddressLoading}
              formError={showErr(errors.addressId)}
            />

            <ItemsSection
              step={2}
              product={singleProduct}
              qty={quantity}
              loading={isProductLoading}
              error={showErr(
                typeof errors.items === "string" ? errors.items : undefined,
              )}
              onChangeQty={changeQty}
            />

            <PaymentSection
              step={3}
              value={values.paymentMethod}
              onChange={(m) => setFieldValue("paymentMethod", m)}
              error={showErr(errors.paymentMethod)}
            />

            <NoteSection
              step={4}
              note={values.notes}
              onChange={(n) => setFieldValue("notes", n)}
            />
            {showErr(errors.notes) && (
              <p className="text-xs text-red-500">{errors.notes}</p>
            )}
          </div>

          <OrderSummary
            totals={totals}
            coupon={coupon}
            couponProps={{
              input: couponInput,
              error: couponError,
              onInputChange: setCouponInput,
              onApply: applyCoupon,
              onRemove: removeCoupon,
            }}
            delivery={delivery}
            paymentId={values.paymentMethod}
            selectedAddress={selectedAddress}
            canPlace={
              !!singleProduct &&
              !!values.addressId &&
              !isProcessing &&
              !isOrderLoading &&
              !formik.isSubmitting
            }
            onPlace={formik.handleSubmit}
          />
        </form>
      </main>
    </div>
  );
}
