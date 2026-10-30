import {
  User,
  MapPin,
  PackageCheck,
  Ticket,
  CreditCard,
  ShieldCheck,
  SlidersHorizontal,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { FormCard } from "../../components/ui/FormCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const tiles = [
  {
    title: "Personal Info",
    desc: "Name, email, phone and date of birth",
    icon: User,
    path: "/user/profile/personal-info",
  },
  {
    title: "Address Book",
    desc: "Manage delivery and billing addresses",
    icon: MapPin,
    path: "/user/profile/addresses",
  },
  {
    title: "Orders & Returns",
    desc: "Track orders, return or exchange items",
    icon: PackageCheck,
    path: "/user/profile/orders",
  },
  {
    title: "Coupons & Offers",
    desc: "Your active coupons and exclusive deals",
    icon: Ticket,
    path: "/user/profile/coupons",
  },
  {
    title: "Payment Methods",
    desc: "Saved cards, UPI and wallets",
    icon: CreditCard,
    path: "/user/profile/payments",
  },
  {
    title: "Login & Security",
    desc: "Password, 2-step verification, devices",
    icon: ShieldCheck,
    path: "/user/profile/security",
  },
  {
    title: "Shopping Preferences",
    desc: "Sizes, brands, language and notifications",
    icon: SlidersHorizontal,
    path: "/user/profile/preferences",
  },
  {
    title: "Likes & Reviews",
    desc: "Wishlist items and reviews you've written",
    icon: Heart,
    path: "/user/profile/likes-reviews",
  },
];

export default function UserProfile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main className="mx-auto max-w-7xl px-5 sm:pb-16 pb-9 pt-0 sm:pt-9 ">
        {/* Hero */}
        <section className="mb-9 flex flex-wrap justify-evenly items-center border-b pb-6 gap-5">
          <div className="sm:flex flex-wrap items-center gap-5">
            <div className="grid sm:h-20 sm:mx-0 mx-auto sm:w-20 w-10 h-10 place-items-center rounded-full border-2 sm:text-3xl text-xl font-bold p-1">
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.firstName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="sm:text-3xl text-xl font-bold tracking-tight">
                {user.firstName.charAt(0).toUpperCase() +
                  user.firstName.slice(1) +
                  " " +
                  user.lastName}
              </h1>
              <p className="mt-1 text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Tiles */}
        <nav
          aria-label="Account sections"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {tiles.map(({ title, desc, icon: Icon, path }) => (
            <FormCard
              key={title}
              className="group relative flex-col min-w-[280px] max-w-full justify-between border p-4 transition-all duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-md sm:min-h-[190px] sm:p-5"
            >
              <div
                onClick={() => navigate(path)}
                className="group relative flex h-full flex-col justify-between outline-none after:absolute after:inset-0"
              >
                <ArrowUpRight className="absolute right-0 top-0 h-5 w-5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                <Icon className="h-8 w-8" strokeWidth={1.6} />
                <div>
                  <h2 className="mb-1.5 mt-4 text-[15px] font-bold sm:text-lg">
                    {title}
                  </h2>
                  <p className="text-xs leading-snug text-neutral-500 sm:text-[13px]">
                    {desc}
                  </p>
                </div>
              </div>
            </FormCard>
          ))}
        </nav>
      </main>
    </>
  );
}
