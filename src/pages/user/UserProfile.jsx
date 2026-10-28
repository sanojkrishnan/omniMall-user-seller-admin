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
import { StatCard } from "../../components/ui/StatCard";

const tiles = [
  {
    title: "Personal Info",
    desc: "Name, email, phone and date of birth",
    icon: User,
    href: "/profile/personal-info",
  },
  {
    title: "Address Book",
    desc: "Manage delivery and billing addresses",
    icon: MapPin,
    href: "/profile/addresses",
  },
  {
    title: "Orders & Returns",
    desc: "Track orders, return or exchange items",
    icon: PackageCheck,
    href: "/profile/orders",
  },
  {
    title: "Coupons & Offers",
    desc: "Your active coupons and exclusive deals",
    icon: Ticket,
    href: "/profile/coupons",
  },
  {
    title: "Payment Methods",
    desc: "Saved cards, UPI and wallets",
    icon: CreditCard,
    href: "/profile/payments",
  },
  {
    title: "Login & Security",
    desc: "Password, 2-step verification, devices",
    icon: ShieldCheck,
    href: "/profile/security",
  },
  {
    title: "Shopping Preferences",
    desc: "Sizes, brands, language and notifications",
    icon: SlidersHorizontal,
    href: "/profile/preferences",
  },
  {
    title: "Likes & Reviews",
    desc: "Wishlist items and reviews you've written",
    icon: Heart,
    href: "/profile/likes-reviews",
  },
];

const stats = [
  { label: "Orders", value: 12, icon: PackageCheck },
  { label: "Coupons", value: 5, icon: Ticket },
  { label: "Likes", value: 28, icon: Heart },
];

export default function UserProfile({
  user = { name: "Aarav", email: "aarav@example.com", since: 2024 },
}) {
  return (
    <>
      {/* spacer for the fixed navbar */}
      <div className="h-24 w-full" />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-9 ">
        {/* Hero */}
        <section className="mb-9 flex flex-wrap  items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-black text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hello, {user.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {user.email} · Member since {user.since}
            </p>
            <span className="mt-2 inline-block border-[1.5px] border-black px-2.5 py-0.5 text-[11px] uppercase tracking-widest">
              Omni Plus Member
            </span>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-9 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
            />
          ))}
        </section>

        {/* Tiles */}
        <nav
          aria-label="Account sections"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {tiles.map(({ title, desc, icon: Icon, href }) => (
            <FormCard
              key={title}
              className="flex-col min-w-[280px] max-w-full justify-between border p-4 transition-all duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-md sm:min-h-[190px] sm:p-5"
            >
              {/* the after: layer makes the whole card clickable */}
              <a
                href={href}
                className="flex h-full flex-col justify-between outline-none after:absolute after:inset-0"
              >
                <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                <Icon className="h-8 w-8" strokeWidth={1.6} />
                <div>
                  <h2 className="mb-1.5 mt-4 text-[15px] font-bold sm:text-lg">
                    {title}
                  </h2>
                  <p className="text-xs leading-snug text-neutral-500 sm:text-[13px]">
                    {desc}
                  </p>
                </div>
              </a>
            </FormCard>
          ))}
        </nav>
      </main>
    </>
  );
}
