import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import ToggleSwitch from "./ui/ToggleSwitch";

/* ---------- options ---------- */
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
const CATEGORIES = [
  "Fashion",
  "Electronics",
  "Home & Kitchen",
  "Beauty",
  "Books",
  "Sports",
  "Toys",
  "Grocery",
];
const LANGUAGES = ["English", "മലയാളം", "हिन्दी", "தமிழ்"];
const DELIVERY_TIMES = ["Anytime", "Morning", "Evening", "Weekends"];
const CHANNELS = ["Email", "SMS", "WhatsApp", "App notifications"];
const NOTIFY_ITEMS = [
  {
    key: "orders",
    title: "Order updates",
    desc: "Shipping, delivery and return status.",
  },
  {
    key: "offers",
    title: "Offers & coupons",
    desc: "New deals picked for you.",
  },
  {
    key: "priceDrops",
    title: "Price drops",
    desc: "When something you liked gets cheaper.",
  },
  {
    key: "restock",
    title: "Back in stock",
    desc: "When a sold-out item returns.",
  },
];

/* ---------- static data ---------- */
const initialPrefs = {
  clothingSize: "M",
  shoeSize: "UK 9",
  categories: ["Fashion", "Electronics", "Sports"],
  brands: ["Nike", "Samsung", "Fabindia"],
  language: "English",
  delivery: "Anytime",
  notify: { orders: true, offers: true, priceDrops: true, restock: false },
  channels: ["Email", "SMS"],
};

/* ---------- small pieces ---------- */
function Section({ title, hint, children }) {
  return (
    <section className="rounded-2xl border border-black/15 bg-white p-5 sm:p-6">
      <h2 className="font-bold">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-neutral-500">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition sm:text-sm ${
        on
          ? "border-black bg-black text-white"
          : "border-black/25 hover:border-black"
      }`}
    >
      {children}
    </button>
  );
}

const toggleIn = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

/* ---------- page ---------- */
export default function ShoppingPreferences() {
  const [saved, setSaved] = useState(initialPrefs);
  const [prefs, setPrefs] = useState(initialPrefs);
  const [brandDraft, setBrandDraft] = useState("");

  const dirty = JSON.stringify(prefs) !== JSON.stringify(saved);
  const set = (key, value) => setPrefs((p) => ({ ...p, [key]: value }));

  const addBrand = () => {
    const b = brandDraft.trim();
    if (b && !prefs.brands.some((x) => x.toLowerCase() === b.toLowerCase())) {
      set("brands", [...prefs.brands, b]);
    }
    setBrandDraft("");
  };

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main
        className={`mx-auto max-w-6xl px-4 pt-1 sm:px-6 ${dirty ? "pb-32" : "pb-20"}`}
      >
        <BackButtonUser variant="secondary" />

        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Shopping Preferences
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Tell us what you like so OmniMall can show you better picks.
          </p>
        </header>

        <div className="space-y-5">
          <Section
            title="Your sizes"
            hint="We'll pre-select these when you shop."
          >
            <p className="mb-2 text-xs font-semibold text-neutral-500">
              Clothing
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {CLOTHING_SIZES.map((s) => (
                <Chip
                  key={s}
                  on={prefs.clothingSize === s}
                  onClick={() => set("clothingSize", s)}
                >
                  {s}
                </Chip>
              ))}
            </div>
            <p className="mb-2 text-xs font-semibold text-neutral-500">
              Footwear
            </p>
            <div className="flex flex-wrap gap-2">
              {SHOE_SIZES.map((s) => (
                <Chip
                  key={s}
                  on={prefs.shoeSize === s}
                  onClick={() => set("shoeSize", s)}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </Section>

          <Section
            title="Favourite categories"
            hint="Pick as many as you like."
          >
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  on={prefs.categories.includes(c)}
                  onClick={() =>
                    set("categories", toggleIn(prefs.categories, c))
                  }
                >
                  {c}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title="Favourite brands">
            <div className="mb-4 flex flex-wrap gap-2">
              {prefs.brands.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 rounded-full border border-black py-1.5 pl-4 pr-2 text-xs font-semibold sm:text-sm"
                >
                  {b}
                  <button
                    type="button"
                    aria-label={`Remove ${b}`}
                    onClick={() =>
                      set(
                        "brands",
                        prefs.brands.filter((x) => x !== b),
                      )
                    }
                    className="grid h-5 w-5 place-items-center rounded-full hover:bg-black hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {prefs.brands.length === 0 && (
                <p className="text-sm text-neutral-500">No brands added yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={brandDraft}
                onChange={(e) => setBrandDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBrand();
                  }
                }}
                placeholder="Add a brand"
                className="min-w-0 flex-1 rounded-xl border border-black/25 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-black"
              />
              <Button type="button" onClick={addBrand} className="w-fit">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </Section>

          <Section title="Language & delivery">
            <p className="mb-2 text-xs font-semibold text-neutral-500">
              App language
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Chip
                  key={l}
                  on={prefs.language === l}
                  onClick={() => set("language", l)}
                >
                  {l}
                </Chip>
              ))}
            </div>
            <p className="mb-2 text-xs font-semibold text-neutral-500">
              Preferred delivery time
            </p>
            <div className="flex flex-wrap gap-2">
              {DELIVERY_TIMES.map((t) => (
                <Chip
                  key={t}
                  on={prefs.delivery === t}
                  onClick={() => set("delivery", t)}
                >
                  {t}
                </Chip>
              ))}
            </div>
          </Section>

          <Section
            title="Notifications"
            hint="Choose what we tell you about, and where."
          >
            <ul className="divide-y divide-black/10">
              {NOTIFY_ITEMS.map(({ key, title, desc }) => (
                <li
                  key={key}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-neutral-500">{desc}</p>
                  </div>
                  <ToggleSwitch
                    variant="user"
                    checked={prefs.notify[key]}
                    onChange={(c) =>
                      set("notify", { ...prefs.notify, [key]: c })
                    }
                  />
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-5 text-xs font-semibold text-neutral-500">
              Send me updates by
            </p>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((c) => (
                <Chip
                  key={c}
                  on={prefs.channels.includes(c)}
                  onClick={() => set("channels", toggleIn(prefs.channels, c))}
                >
                  {c}
                </Chip>
              ))}
            </div>
          </Section>
        </div>
      </main>

      {/* unsaved changes bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-black bg-white transition-transform duration-300 ${
          dirty ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="text-sm font-medium">You have unsaved changes</p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="w-fit"
              onClick={() => setPrefs(saved)}
            >
              Reset
            </Button>
            <Button className="w-fit" onClick={() => setSaved(prefs)}>
              Save preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
