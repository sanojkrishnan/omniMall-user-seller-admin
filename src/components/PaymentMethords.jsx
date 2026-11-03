import { useState } from "react";
import * as Yup from "yup";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  Check,
  ShieldCheck,
} from "lucide-react";
import BackButtonUser from "./ui/BackButtonUser";
import { CreatePanel } from "./ui/CreatePanel";
import { EditPanel } from "./ui/EditPanel";
import ConfirmProvider from "./ui/ConfirmProvider";
import { Button } from "./ui/Button";

/* ---------- static data ---------- */
// Note: only the last 4 digits are ever kept. Never store full card numbers or CVV.
const initialMethods = [
  {
    id: 1,
    type: "card",
    brand: "Visa",
    last4: "4417",
    nameOnCard: "Aarav Menon",
    expiry: "08/28",
    isDefault: true,
  },
  {
    id: 2,
    type: "card",
    brand: "Mastercard",
    last4: "3086",
    nameOnCard: "Aarav Menon",
    expiry: "09/26",
    isDefault: false,
  },
  {
    id: 3,
    type: "upi",
    upiId: "aarav@okaxis",
    nickname: "Personal UPI",
    isDefault: false,
  },
  {
    id: 4,
    type: "upi",
    upiId: "meera.menon@oksbi",
    nickname: "",
    isDefault: false,
  },
  {
    id: 5,
    type: "wallet",
    provider: "Paytm",
    phone: "+91 98765 43210",
    isDefault: false,
  },
];

const SECTIONS = [
  {
    type: "card",
    title: "Cards",
    icon: CreditCard,
    addLabel: "Add card",
    empty: "No cards saved yet.",
  },
  {
    type: "upi",
    title: "UPI",
    icon: Smartphone,
    addLabel: "Add UPI ID",
    empty: "No UPI IDs saved yet.",
  },
  {
    type: "wallet",
    title: "Wallets",
    icon: Wallet,
    addLabel: "Link wallet",
    empty: "No wallets linked yet.",
  },
];

const typeIcon = { card: CreditCard, upi: Smartphone, wallet: Wallet };

/* ---------- helpers ---------- */
const detectBrand = (digits) => {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "RuPay";
};

const luhn = (num) => {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const isExpired = (expiry) => {
  const [mm, yy] = expiry.split("/").map(Number);
  const now = new Date();
  const year = 2000 + yy;
  return (
    year < now.getFullYear() ||
    (year === now.getFullYear() && mm < now.getMonth() + 1)
  );
};

const methodTitle = (m) =>
  m.type === "card"
    ? `${m.brand} •••• ${m.last4}`
    : m.type === "upi"
      ? m.nickname || m.upiId
      : m.provider;

const methodSubtitle = (m) =>
  m.type === "card"
    ? `${m.nameOnCard} · Expires ${m.expiry}`
    : m.type === "upi"
      ? m.nickname
        ? m.upiId
        : "UPI ID"
      : `Linked to ${m.phone}`;

// keeps exactly one default method across all types
function normalizeDefaults(list, preferredId) {
  let next = preferredId
    ? list.map((m) => ({ ...m, isDefault: m.id === preferredId }))
    : list;
  if (next.length && !next.some((m) => m.isDefault)) {
    next = next.map((m, i) => (i === 0 ? { ...m, isDefault: true } : m));
  }
  return next;
}

/* ---------- panel config ---------- */
const defaultField = {
  name: "isDefault",
  label: "Default method",
  type: "checkbox",
  checkboxLabel: "Use this as my default payment method",
  span: "full",
  default: false,
};

const nameField = {
  name: "nameOnCard",
  label: "Name on card",
  type: "text",
  span: "full",
  required: true,
};
const expiryField = {
  name: "expiry",
  label: "Expiry (MM/YY)",
  type: "text",
  required: true,
  placeholder: "08/28",
};
const upiFields = [
  {
    name: "upiId",
    label: "UPI ID",
    type: "text",
    span: "full",
    required: true,
    placeholder: "name@bank",
  },
  {
    name: "nickname",
    label: "Nickname",
    type: "text",
    span: "full",
    placeholder: "Optional, e.g. Personal UPI",
  },
  defaultField,
];
const phoneField = {
  name: "phone",
  label: "Mobile number",
  type: "tel",
  span: "full",
  required: true,
};

const cardNumberSchema = Yup.string()
  .required("Enter the card number")
  .test("card-number", "Enter a valid card number", (v) => {
    const d = (v || "").replace(/\s/g, "");
    return /^\d{13,19}$/.test(d) && luhn(d);
  });

const expirySchema = Yup.string()
  .required("Enter the expiry date")
  .test("expiry", "Enter a valid future date (MM/YY)", (v) => {
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v || "");
    return !!m && !isExpired(v);
  });

const upiSchema = Yup.object({
  upiId: Yup.string()
    .matches(
      /^[\w.-]{2,}@[a-zA-Z]{2,}$/,
      "Enter a valid UPI ID, e.g. name@bank",
    )
    .required("Enter the UPI ID"),
  nickname: Yup.string().max(24, "Keep it under 24 characters"),
  isDefault: Yup.boolean(),
});

const phoneSchema = Yup.string()
  .matches(/^\+?[\d\s-]{10,15}$/, "Enter a valid mobile number")
  .required("Enter the mobile number");

const CREATE_CONFIG = {
  card: {
    title: "Add a card",
    subtitle: "We only save the last 4 digits. Your CVV is never stored.",
    submitLabel: "Save card",
    fields: [
      {
        name: "cardNumber",
        label: "Card number",
        type: "text",
        span: "full",
        required: true,
        placeholder: "1234 5678 9012 3456",
      },
      nameField,
      expiryField,
      defaultField,
    ],
    schema: Yup.object({
      cardNumber: cardNumberSchema,
      nameOnCard: Yup.string().trim().required("Enter the name on the card"),
      expiry: expirySchema,
      isDefault: Yup.boolean(),
    }),
  },
  upi: {
    title: "Add a UPI ID",
    subtitle: "Pay quickly with your UPI app.",
    submitLabel: "Save UPI ID",
    fields: upiFields,
    schema: upiSchema,
  },
  wallet: {
    title: "Link a wallet",
    subtitle: "Choose a wallet and the mobile number linked to it.",
    submitLabel: "Link wallet",
    fields: [
      {
        name: "provider",
        label: "Wallet",
        type: "select",
        span: "full",
        required: true,
        placeholder: "Select a wallet",
        options: ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"].map((p) => ({
          label: p,
          value: p,
        })),
      },
      phoneField,
      defaultField,
    ],
    schema: Yup.object({
      provider: Yup.string().required("Select a wallet"),
      phone: phoneSchema,
      isDefault: Yup.boolean(),
    }),
  },
};

const EDIT_CONFIG = {
  card: {
    title: "Edit card",
    fields: [nameField, expiryField, defaultField],
    schema: Yup.object({
      nameOnCard: Yup.string().trim().required("Enter the name on the card"),
      expiry: expirySchema,
      isDefault: Yup.boolean(),
    }),
    values: (m) => ({
      nameOnCard: m.nameOnCard,
      expiry: m.expiry,
      isDefault: m.isDefault,
    }),
  },
  upi: {
    title: "Edit UPI ID",
    fields: upiFields,
    schema: upiSchema,
    values: (m) => ({
      upiId: m.upiId,
      nickname: m.nickname,
      isDefault: m.isDefault,
    }),
  },
  wallet: {
    title: "Edit wallet",
    fields: [phoneField, defaultField],
    schema: Yup.object({ phone: phoneSchema, isDefault: Yup.boolean() }),
    values: (m) => ({ phone: m.phone, isDefault: m.isDefault }),
  },
};

const buildMethod = (kind, values, id) => {
  const { isDefault, ...rest } = values;
  if (kind === "card") {
    const digits = rest.cardNumber.replace(/\s/g, "");
    // only the brand and last 4 digits leave this function
    return {
      id,
      type: "card",
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      nameOnCard: rest.nameOnCard,
      expiry: rest.expiry,
      isDefault,
    };
  }
  if (kind === "upi")
    return {
      id,
      type: "upi",
      upiId: rest.upiId,
      nickname: rest.nickname,
      isDefault,
    };
  return {
    id,
    type: "wallet",
    provider: rest.provider,
    phone: rest.phone,
    isDefault,
  };
};

/* ---------- method card ---------- */
function MethodCard({ method, onEdit, onRemove, onSetDefault }) {
  const Icon = typeIcon[method.type];
  const expired = method.type === "card" && isExpired(method.expiry);

  return (
    <article
      className={`rounded-2xl border bg-white p-5 transition sm:p-6 ${
        method.isDefault
          ? "border-black"
          : "border-black/15 hover:border-black/60"
      }`}
    >
      <div className="flex gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black">
          <Icon className="h-5 w-5" strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-bold">{methodTitle(method)}</h3>
            {method.isDefault && (
              <span className="flex items-center gap-1 rounded-full bg-black px-2.5 py-0.5 text-[11px] font-semibold text-white">
                <Check className="h-3 w-3" /> Default
              </span>
            )}
            {expired && (
              <span className="rounded-full border border-black px-2.5 py-0.5 text-[11px] font-semibold">
                Expired
              </span>
            )}
          </div>
          <p className="mt-1 break-all text-sm text-neutral-600">
            {methodSubtitle(method)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4 sm:pl-[60px]">
        <Button onClick={onEdit} className="w-fit shadow-none">
          <Pencil className="h-3 w-3" /> Edit
        </Button>
        <Button
          onClick={onRemove}
          className="w-fit text-red-500 shadow-none"
          variant="secondary"
        >
          <Trash2 className="h-3 w-3" /> Remove
        </Button>
        {!method.isDefault && !expired && (
          <button
            onClick={onSetDefault}
            className="ml-auto text-xs font-semibold underline underline-offset-4 hover:opacity-60"
          >
            Set as default
          </button>
        )}
      </div>
    </article>
  );
}

/* ---------- page ---------- */
export default function PaymentMethods() {
  const [methods, setMethods] = useState(initialMethods);

  // add (kind is kept after closing so the panel doesn't change while animating out)
  const [createKind, setCreateKind] = useState("card");
  const [createOpen, setCreateOpen] = useState(false);

  // edit
  const [editingId, setEditingId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const editing = methods.find((m) => m.id === editingId);
  const editConfig = EDIT_CONFIG[editing?.type ?? "card"];

  // remove confirmation
  const [removeTarget, setRemoveTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const createConfig = CREATE_CONFIG[createKind];

  const handleCreate = (values) => {
    const id = Date.now();
    setMethods((list) =>
      normalizeDefaults(
        [...list, buildMethod(createKind, values, id)],
        values.isDefault ? id : null,
      ),
    );
    setCreateOpen(false);
  };

  const handleEdit = (values) => {
    const { isDefault, ...rest } = values;
    setMethods((list) =>
      normalizeDefaults(
        list.map((m) => (m.id === editingId ? { ...m, ...rest } : m)),
        isDefault ? editingId : null,
      ),
    );
    setEditOpen(false);
  };

  const handleRemoveResult = (confirmed) => {
    setConfirmOpen(false);
    if (!confirmed || !removeTarget) return;
    setMethods((list) =>
      normalizeDefaults(
        list.filter((m) => m.id !== removeTarget.id),
        null,
      ),
    );
  };

  const setDefault = (id) => setMethods((list) => normalizeDefaults(list, id));

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-1 sm:px-6">
        <BackButtonUser variant="secondary" />

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Save your cards, UPI IDs and wallets for faster checkout.
          </p>
        </header>

        <div className="space-y-10">
          {SECTIONS.map(({ type, title, icon: Icon, addLabel, empty }) => {
            const list = methods
              .filter((m) => m.type === type)
              .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

            return (
              <section key={type}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                    <Icon className="h-4 w-4" /> {title}
                  </h2>
                  <Button
                    onClick={() => {
                      setCreateKind(type);
                      setCreateOpen(true);
                    }}
                    className="w-fit"
                  >
                    <Plus className="h-3.5 w-3.5" /> {addLabel}
                  </Button>
                </div>

                <div className="space-y-4">
                  {list.map((m) => (
                    <MethodCard
                      key={m.id}
                      method={m}
                      onEdit={() => {
                        setEditingId(m.id);
                        setEditOpen(true);
                      }}
                      onRemove={() => {
                        setRemoveTarget(m);
                        setConfirmOpen(true);
                      }}
                      onSetDefault={() => setDefault(m.id)}
                    />
                  ))}

                  {list.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-black/30 px-6 py-8 text-center text-sm text-neutral-500">
                      {empty}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-10 flex items-start gap-2 text-xs text-neutral-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Your payment details are encrypted. We never store your full card
          number or CVV.
        </p>
      </main>

      <CreatePanel
        variant="user"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={createConfig.title}
        subtitle={createConfig.subtitle}
        fields={createConfig.fields}
        validationSchema={createConfig.schema}
        submitLabel={createConfig.submitLabel}
        onSubmit={handleCreate}
      />

      <EditPanel
        variant="user"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={editConfig.title}
        subtitle={editing ? methodTitle(editing) : undefined}
        fields={editConfig.fields}
        initialValues={editing ? editConfig.values(editing) : {}}
        validationSchema={editConfig.schema}
        submitLabel="Save changes"
        onSubmit={handleEdit}
      />

      <ConfirmProvider
        variant="user"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onResult={handleRemoveResult}
      >
        Are you sure you want to remove{" "}
        {removeTarget ? methodTitle(removeTarget) : "this method"}?
      </ConfirmProvider>
    </div>
  );
}
