import { Link } from "react-router-dom";
import {
  Bell,
  ExternalLinkIcon,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Store,
  ThumbsUp,
  User,
} from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";
import P2 from "./P2";

// `selection` values come from SellerLayout: home | dashboard | products | profile
const navItems = [
  {
    key: "home",
    label: "Dashboard",
    to: "/seller",
    icon: LayoutDashboard,
  },
  {
    key: "products",
    label: "Products",
    to: "/seller/products",
    icon: ShoppingCart,
  },
  { key: "orders", label: "Orders", to: "/seller/orders", icon: Package },
  {
    key: "reviews",
    label: "Reviews & Likes",
    to: "/seller/reviews",
    icon: ThumbsUp,
  },
  { key: "profile", label: "Profile", to: "/seller/profile", icon: User },
];

function SellerHeader({
  selection = "home",
  borderLine = true,
  storeName = "My Store", // later: from the seller slice
}) {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDot, setNotificationDot] = useState(true);
  const [ringKey, setRingKey] = useState(0);

  return (
    <header
      className={`w-full bg-white sticky top-0 z-30 border-b shadow-lg ${borderLine ? "border-b" : ""}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-3 py-3">
        {/* brand */}
        <Link to="/seller" className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0">
            <Store className="size-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="font-semibold text-sm truncate">{storeName}</p>
            <p className="text-xs text-gray-500">Seller panel</p>
          </div>
        </Link>

        {/* nav (desktop) */}
        <nav aria-label="Seller navigation" className="hidden md:block">
          <ul className="flex gap-1 p-2 rounded-full border">
            {navItems.map(({ key, label, to, icon: Icon }) => (
              <li key={key}>
                <Link
                  to={to}
                  aria-current={selection === key ? "page" : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${
                    selection === key
                      ? "bg-black text-white border-black"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="hidden lg:block">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* actions */}
        <div className="flex items-center gap-2">
          <Button
            className={"text-red-500 rounded-full px-2 py-2 shadow-none"}
            variant="secondary"
          >
            <LogOut className="size-4" />{" "}
            <span className="hidden lg:block">Exit Seller</span>
          </Button>
          <Button
            variant="secondary"
            className="rounded-full w-fit px-2 py-2 sm:py-2 sm:px-2 shadow-none"
            onMouseDown={(e) => {
              e.stopPropagation();
              setShowNotification((prev) => !prev);
              setNotificationDot(false);
              setRingKey((prev) => prev + 1);
            }}
          >
            <div key={ringKey} className="relative">
              <Bell className="size-4 origin-top animate-bellRing" />
              <div
                className={`
                absolute -top-1 -right-1 p-1 rounded-full bg-red-500
                transition-all duration-300
                ${notificationDot ? "scale-100 opacity-100" : "scale-0 opacity-0"}
              `}
              />
            </div>
          </Button>

          <div
            className={`border absolute top-16 right-48 rounded-b-lg p-2 shadow-lg w-80 min-h-4 ${showNotification ? "scale-y-100 " : "scale-y-0 "} origin-top transition-all duration-500 bg-white`}
          >
            <P2
              className={`${showNotification ? "opacity-100" : "opacity-0"} transition-all duration-200 text-gray-500`}
            >
              No notifications
            </P2>
          </div>
        </div>
      </div>

      {/* nav (mobile): scrollable tabs under the top bar */}
      <nav aria-label="Seller navigation" className="md:hidden border-t">
        <ul className="flex items-center justify-evenly overflow-x-auto px-2 py-1 gap-1">
          {navItems.map(({ key, label, to, icon: Icon }) => (
            <li key={key} className="shrink-0">
              <Link
                to={to}
                aria-current={selection === key ? "page" : undefined}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
                  selection === key
                    ? "bg-black text-white border-black"
                    : "border-transparent"
                }`}
              >
                <Icon className="size-4 " />
                <span className="hidden sm:block">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default SellerHeader;
