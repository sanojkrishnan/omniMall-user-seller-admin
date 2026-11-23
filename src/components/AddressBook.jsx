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
  clearAddressError,
  deleteAddress,
  fetchAllAddress,
  setDefaultAddress,
  updateAddress,
} from "../redux/slice/addressSlice";
import { useToastError } from "../hooks/useToastError";
import { toast } from "react-toastify";
import AddressCard from "./ui/AddressCard";
import { getErrorMessage } from "../utils/getErrorMessage";

const ADDRESS_LABELS = ["home", "work", "other"];

// excludeId = the address being edited, so its own label stays selectable
function getAddressFields(address, excludeId = null, editing = false) {
  const used = address.filter((a) => a._id !== excludeId).map((a) => a.label);
  const available = ADDRESS_LABELS.filter((l) => !used.includes(l));

  return [
    ...(!editing
      ? [
          {
            name: "label",
            label: "Address type",
            type: "radio",
            span: "full",
            required: true,
            default: available[0] ?? "",
            options: available.map((l) => ({
              label: l[0].toUpperCase() + l.slice(1),
              value: l,
            })),
          },
        ]
      : []),
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

    // the default checkbox only exists when adding; editing uses "Set as default" on the card
    ...(!editing
      ? [
          {
            name: "isDefault",
            label: "Default address",
            type: "checkbox",
            checkboxLabel: "Make this my default address",
            default: address.length === 0,
          },
        ]
      : []),
  ];
}

/* ---------- page ---------- */
export default function AddressBook() {
  const dispatch = useDispatch();
  const {
    address = [],
    isAddressLoading,
    addressError,
  } = useSelector((state) => state.address);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAddress());
    return () => {
      dispatch(clearAddressError());
    };
  }, [dispatch]);

  useToastError({
    errorMessage: !isAddressLoading ? addressError : null,
    fallbackErrorMessage: "Failed to load addresses",
  });

  async function handleCreate(values) {
    try {
      const res = await dispatch(addAddress({ values })).unwrap();
      toast.success(res?.message || "Address added");
      setCreateOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to add address");
    }
  }

  async function handleSetDefault(addressId) {
    try {
      const res = await dispatch(setDefaultAddress({ addressId })).unwrap();
      toast.success(res?.message || "Default address updated");
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to set default address");
    }
  }

  async function handleDeleteResult(confirmed, id) {
    setConfirmOpen(false);
    if (!confirmed || !id) return;

    try {
      const res = await dispatch(deleteAddress({ addressId: id })).unwrap();
      toast.success(res?.message || "Address deleted");
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to delete address");
    }
  }

  async function handleEditSubmit(values, id) {
    if (!id) return;

    try {
      const res = await dispatch(
        updateAddress({ addressId: id, values }),
      ).unwrap();
      toast.success(res?.message || "Address updated");
      setEditOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to update address");
    }
  }

  const editing = address.find((a) => a._id === editingId);
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

  // default address first
  const sortedAddresses = [...address].sort(
    (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0),
  );

  // one loading flag from Redux decides everything
  const showLoading = isAddressLoading && !addressError;
  const showEmpty = !isAddressLoading && !addressError && address.length === 0;
  const showList = !isAddressLoading && !addressError && address.length > 0;

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
                {`${address.length} saved ${address.length === 1 ? "address" : "addresses"}`}
              </p>
            </div>
            <Button
              className="w-fit"
              disabled={address.length >= 3}
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
                  onSetDefault={() => handleSetDefault(a._id)}
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
        id={editingId}
        title={`Edit ${editing?.label} address`}
        subtitle={editing ? `${editing.label} · ${editing.name}` : undefined}
        fields={getAddressFields(address, editingId, editing)}
        initialValues={editingValues}
        validationSchema={addressSchema}
        submitLabel="Save changes"
        onSubmit={handleEditSubmit}
      />

      <ConfirmProvider
        variant="user"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        id={deleteTarget?._id}
        onResult={handleDeleteResult}
      >
        Are you sure you want to delete this address?
      </ConfirmProvider>
    </div>
  );
}
