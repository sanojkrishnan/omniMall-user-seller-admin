import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
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
  setDefaultAddress,
} from "../redux/slice/addressSlice";
import { useToastError } from "../hooks/useToastError";
import { toast } from "react-toastify";
import AddressCard from "./ui/AddressCard";

const ADDRESS_LABELS = ["home", "work", "other"];

// excludeId = the address being edited, so its own label stays selectable
function getAddressFields(address, excludeId = null) {
  const used = address.filter((a) => a._id !== excludeId).map((a) => a.label);

  const available = ADDRESS_LABELS.filter((l) => !used.includes(l));

  return [
    {
      name: "label",
      label: "Address type",
      type: "radio",
      span: "full",
      required: true,
      default: available[0] ?? "", // plain value, not a function
      options: available.map((l) => ({
        label: l[0].toUpperCase() + l.slice(1),
        value: l,
      })),
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
      default: address.length === 0, // optional: first address defaults to true
    },
  ];
}

/* ---------- page ---------- */
export default function AddressBook() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [requested, setRequested] = useState(false);
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
      await dispatch(addAddress({ values })).unwrap();
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

  function handleDeleteResult(confirmed) {
    setConfirmOpen(false);
    if (confirmed) {
      // dispatch(deleteSingleCoupon({ id: singleCoupon._id }));
      // dispatch(clearCouponState());
      toast.success("Coupon deleted successfully");
      // navigate("/admin/coupon");
    }
  }

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

  const sortedAddresses =
    address.length !== 0
      ? [...address].sort(
          (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0),
        )
      : [];

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
            <Button
              className="w-fit"
              disabled={address.length === 3}
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add new address
            </Button>
          </header>

          <div className="space-y-4">
            {showList &&
              sortedAddresses.map((a) => (
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
                  onSetDefault={() => {
                    dispatch(setDefaultAddress({ addressId: a._id }));
                  }}
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
        fields={getAddressFields(address)}
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
        fields={getAddressFields(address, editingId)}
        initialValues={editingValues}
        validationSchema={addressSchema}
        submitLabel="Save changes"
        // onSubmit={handleEdit}
      />

      <ConfirmProvider
        variant="user"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onResult={handleDeleteResult}
      >
        Are you sure you want to delete this address?
      </ConfirmProvider>
    </div>
  );
}
