import { useEffect, useState } from "react";
import {
  Home,
  Briefcase,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Check,
} from "lucide-react";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import { CreatePanel } from "./ui/CreatePanel";
import { EditPanel } from "./ui/EditPanel";
import ConfirmProvider from "./ui/ConfirmProvider";
import { addressSchema } from "../validation/addressSchema";
import { useDispatch, useSelector } from "react-redux";
import CartLoading from "./ui/CartLoading";
import ErrorFallback from "./ui/ErrorFallback";
import {
  addAddress,
  clearSellerError,
  fetchAllAddress,
} from "../redux/slice/addressSlice";
import { useToastError } from "../hooks/useToastError";
import { toast } from "react-toastify";

/* ---------- panel config (shared by create + edit) ---------- */
const ADDRESS_FIELDS = [
  {
    name: "label",
    label: "Address type",
    type: "radio",
    span: "full",
    default: "Home",
    required: true,
    options: [
      { label: "Home", value: "home" },
      { label: "Work", value: "work" },
      { label: "Other", value: "other" },
    ],
  },
  { name: "name", label: "Full name", type: "text", required: true },
  { name: "phone", label: "Phone number", type: "phone", required: true },
  {
    name: "line1",
    label: "Address",
    type: "text",
    span: "full",
    required: true,
    placeholder: "House no., building, street",
  },
  {
    name: "line2",
    label: "Landmark",
    type: "text",
    span: "full",
    placeholder: "Optional",
  },
  { name: "city", label: "City", type: "text", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "pincode", label: "Pincode", type: "text", required: true },
  {
    name: "isDefault",
    label: "Default address",
    type: "checkbox",
    checkboxLabel: "Make this my default address",
    default: false,
  },
];

const labelIcons = { Home, Work: Briefcase, Other: MapPin };

/* ---------- address card ---------- */
function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const Icon = labelIcons[address.label] ?? MapPin;

  return (
    <article
      className={`rounded-2xl border bg-white p-5 transition sm:p-6 ${
        address.isDefault
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
            <h3 className="font-bold">{address.label}</h3>
            {address.isDefault && (
              <span className="flex items-center gap-1 rounded-full bg-black px-2.5 py-0.5 text-[11px] font-semibold text-white">
                <Check className="h-3 w-3" /> Default
              </span>
            )}
          </div>

          <p className="mt-2 text-sm font-semibold">{address.name}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
            <br />
            {address.city}, {address.state} {address.pincode}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
            <Phone className="h-3.5 w-3.5" /> {address.phone}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4 sm:pl-[60px]">
        <Button onClick={onEdit} className="w-fit">
          <Pencil className="h-3 w-3" /> Edit
        </Button>
        <Button
          onClick={onDelete}
          variant="secondary"
          className="text-red-400 hover:text-red-500 w-fit"
        >
          <Trash2 className="h-3 w-3" /> Delete
        </Button>
        {!address.isDefault && (
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
export default function AddressBook() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [createError, setCreateError] = useState(null);
  const {
    address = [],
    addressMessage,
    isAddressLoading,
    addressError,
  } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  // kept after the edit panel closes so its close animation still has data
  const [editingId, setEditingId] = useState(null);
  // the address awaiting delete confirmation (kept so the message stays stable while closing)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleCreate(values) {
    try {
      setCreateError(null);
      console.log("VALUES FROM COUPON : ", values);
      await dispatch(addAddress({ values: values })).unwrap();
      toast.success(addressMessage);
      setCreateOpen(false);
    } catch {
      //the error is already handled in the slice, so we just read it from the state and display it in the form
    }
  }

  const editing = address?.find((a) => a._id === editingId);
  const editingValues = editing
    ? {
        label: editing.label,
        name: editing.name,
        phone: editing.phone,
        line1: editing.line1,
        line2: editing.line2,
        city: editing.city,
        state: editing.state,
        pincode: editing.pincode,
        isDefault: editing.isDefault,
      }
    : {};

  useToastError({
    errorMessage: requested && !isAddressLoading ? addressError : null,
    fallbackErrorMessage: "Failed to load addresses",
  });

  useEffect(() => {
    dispatch(fetchAllAddress());
    setRequested(true);
    return () => {
      dispatch(clearSellerError());
    };
  }, [dispatch]);

  const showLoading =
    (!requested || isAddressLoading) && !addressError && address.length === 0;

  const showEmpty =
    requested && !isAddressLoading && !addressError && address.length === 0;

  const showList = !addressError && address.length > 0;
  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />
      {showLoading && (
        <div className="w-full h-[80vh] flex items-center justify-center">
          <CartLoading />
        </div>
      )}

      {(showList || showEmpty) && (
        <main className="mx-auto max-w-6xl px-4 pb-20 pt-1 sm:px-6">
          <BackButtonUser variant="secondary" />

          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Address Book
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {requested && !isAddressLoading
                  ? `${address.length} saved ${address.length === 1 ? "address" : "addresses"}`
                  : "Loading addresses..."}
              </p>
            </div>
            <Button className="w-fit" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> Add new address
            </Button>
          </header>

          <div className="space-y-4">
            {showList &&
              address.map((a) => (
                <AddressCard
                  key={a._id}
                  address={a}
                  onEdit={() => {
                    setEditingId(a._id);
                    setEditOpen(true);
                  }}
                  onDelete={() => {
                    setDeleteTarget(a);
                    setConfirmOpen(true);
                  }}
                  // onSetDefault={() => setDefault(a.id)}
                />
              ))}

            {showEmpty && (
              <div className="rounded-2xl border-2 border-dashed border-black/30 px-6 py-14 text-center">
                <MapPin className="mx-auto h-8 w-8 text-neutral-400" />
                <p className="mt-3 font-semibold">No saved addresses yet</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Add one to make checkout faster.
                </p>
              </div>
            )}
          </div>
        </main>
      )}
      {addressError && (
        <div className="max-w-6xl mx-auto">
          <BackButtonUser variant="secondary" />
          <ErrorFallback error={addressError} />
        </div>
      )}

      <CreatePanel
        variant="user"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add new address"
        subtitle="Where should we deliver your orders?"
        fields={ADDRESS_FIELDS}
        validationSchema={addressSchema}
        submitLabel="Save address"
        onSubmit={handleCreate}
      />

      <EditPanel
        variant="user"
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit address"
        subtitle={editing ? `${editing.label} · ${editing.name}` : undefined}
        fields={ADDRESS_FIELDS}
        initialValues={editingValues}
        validationSchema={addressSchema}
        submitLabel="Save changes"
        // onSubmit={handleEdit}
      />

      <ConfirmProvider
        variant="user"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        // onResult={handleDeleteResult}
      >
        Are you sure you want to delete your {deleteTarget?.label} address?
      </ConfirmProvider>
    </div>
  );
}
