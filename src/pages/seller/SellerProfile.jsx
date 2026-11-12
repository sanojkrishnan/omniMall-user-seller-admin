import {
  BadgeCheck,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Star,
  Store,
  Truck,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { singleSellerFetch } from "../../redux/slice/sellerSlice";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import { useDateFormatter } from "../../hooks/useDateFormatter";

/* ----------------------------- static data ----------------------------- */

const statusMeta = {
  active: {
    label: "Active",
    cls: "bg-green-500/10 text-green-500 border-green-500",
    icon: BadgeCheck,
    note: "Your store is live and visible to customers.",
  },
  pending: {
    label: "Pending approval",
    cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500",
    icon: Clock,
    note: "Your store is under review.",
  },
  suspended: {
    label: "Suspended",
    cls: "bg-red-500/10 text-red-500 border-red-500",
    icon: X,
    note: "Your store is hidden. Contact support.",
  },
};

/* ---------------------------- small helpers ---------------------------- */

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex-1 min-w-[110px] text-center text-xs p-3 border-t sm:border-r last:border-r-0">
      <Icon className="size-4 mx-auto mb-1" />
      <h5 className="text-gray-500">{label}</h5>
      <p className="font-bold text-base mt-1 whitespace-nowrap">{value}</p>
    </div>
  );
}

function Row({ icon: Icon, label, children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-3 px-2 border-b last:border-b-0">
      <p className="text-xs text-gray-500 flex items-center gap-2">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </p>
      <div className="text-sm break-words">{children}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="shadow-md border rounded-lg mt-6">
      <div className="p-3 border-b">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="px-3">{children}</div>
    </div>
  );
}

/* ------------------------------ component ------------------------------ */

function SellerProfile() {
  const dispatch = useDispatch();
  const dateFormatter = useDateFormatter();
  const { seller, isLoading, sellerError, sellerErrorCode } = useSelector(
    (state) => state.seller,
  );
  useEffect(() => {
    dispatch(singleSellerFetch());
  }, [dispatch]);

  const hasSeller = !!seller?.storeName;

  const showError = !isLoading && !!sellerError;
  const showLoading = isLoading || (!hasSeller && !sellerError);
  const showProfile = !isLoading && !sellerError && hasSeller;

  // only compute status once we know the seller exists
  const status = hasSeller
    ? (statusMeta[seller.status] ?? statusMeta.pending)
    : null;
  const StatusIcon = status?.icon;

  return (
    <div className="max-w-6xl mx-auto px-2 pb-8">
      {showLoading && (
        <div className="w-full h-[80vh] flex items-center justify-center">
          <CartLoading />
        </div>
      )}

      {showError && (
        <ErrorFallback error={sellerError} statusCode={sellerErrorCode} />
      )}

      {showProfile && (
        <>
          {/* page title */}
          <div className="py-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">Store Profile</h1>
              <p className="text-sm text-gray-500">
                How your store appears to customers, plus your contact and
                pickup details.
              </p>
            </div>
          </div>
          <div className="shadow-md border rounded-lg overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-24 h-24 rounded-full border overflow-hidden shrink-0 flex items-center justify-center">
                {seller.businessLogo ? (
                  <img
                    src={seller.businessLogo.url}
                    alt="Store logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="size-8" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h2 className="text-lg font-semibold break-words">
                  {seller.storeName}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Seller since {dateFormatter(seller.createdAt)}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-xs border rounded-lg px-2 py-1 mt-3 ${status.cls}`}
                >
                  <StatusIcon className="size-3.5" />
                  {status.label}
                </span>
                <p className="text-xs text-gray-500 mt-2">{status.note}</p>
              </div>
              <Button className="w-fit mt-0 text-sm flex items-center gap-2">
                <Pencil className="size-4" /> Edit profile
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 grid-cols-1 border-t">
              <Stat icon={Store} label="Products" value={seller.products} />
              <Stat icon={Truck} label="Orders" value={seller.orders} />
              <Stat icon={Star} label="Rating" value={seller.rating} />
            </div>
          </div>
          <Section title="Store details">
            <Row label="Store name">{seller.storeName}</Row>
            <Row label="Product categories">
              <div className="flex flex-wrap gap-2">
                {seller.productCategories.map((c) => (
                  <span
                    key={c}
                    className="text-xs border rounded-full px-2 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Row>
            <Row label="Description">{seller.description}</Row>
          </Section>
          {/* contact */}
          <Section title="Contact">
            <Row icon={Mail} label="Business email">
              {seller.businessEmail}
            </Row>
            <Row icon={Phone} label="Business phone">
              +91 {seller.businessPhone}
            </Row>
          </Section>
          {/* address */}
          <Section title="Address & pickup">
            <Row icon={MapPin} label="Business address">
              {seller.businessAddress}
            </Row>
            <Row icon={Truck} label="Pickup location">
              {seller.pickupLocation}
            </Row>
          </Section>{" "}
        </>
      )}
    </div>
  );
}

export default SellerProfile;
