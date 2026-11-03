import { useState } from "react";
import { Camera, Pencil, HandCoins } from "lucide-react";
import { FormCard } from "./ui/FormCard";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import { FieldLabel } from "./ui/EditFields";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// CSS variables FieldLabel reads (same ones CreatePanel sets on its wrapper).
const THEME_VARS = {
  "--edit-text": "black",
  "--edit-muted": "#525252",
  "--edit-border": "#E5E5E5",
  "--edit-soft": "#FAFAFA",
  "--edit-accent": "black",
  "--edit-accent-soft": "#F5F5F5",
  "--edit-danger": "#b3261e",
};

const COUNTRY_CODES = [
  { code: "+91", label: "IN +91" },
  { code: "+971", label: "AE +971" },
  { code: "+966", label: "SA +966" },
  { code: "+974", label: "QA +974" },
  { code: "+968", label: "OM +968" },
  { code: "+965", label: "KW +965" },
  { code: "+973", label: "BH +973" },
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "US +1" },
];

// "+919876543210", "+91 9876543210" or "9876543210" -> { code, number }
function parsePhone(value) {
  if (!value || value === "Not Assigned") return { code: "+91", number: "" };
  const digitsOnly = String(value).replace(/[\s-]/g, "");
  const match = COUNTRY_CODES.map((c) => c.code)
    .sort((a, b) => b.length - a.length)
    .find((code) => digitsOnly.startsWith(code));
  if (match) return { code: match, number: digitsOnly.slice(match.length) };
  return { code: "+91", number: digitsOnly.replace(/\D/g, "") };
}

/* ---------- small pieces ---------- */
const inputCls =
  "w-full border border-black bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10";

function Group({ title, hint, children }) {
  return (
    <section className="border rounded-xl overflow-hidden shadow-md">
      <div className=" bg-neutral-50 border-b px-5 py-3 sm:px-6">
        <h2 className="text-sm font-bold uppercase tracking-widest">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-neutral-500">{hint}</p>}
      </div>
      <div className="divide-y divide-black/10 px-5 sm:px-6">{children}</div>
    </section>
  );
}

function Row({ label, children, action }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 py-4 sm:grid-cols-[180px_1fr_auto] sm:items-center">
      <div className="col-span-2 sm:col-span-1">
        <FieldLabel>{label}</FieldLabel>
      </div>
      <div className="min-w-0 text-sm font-medium">{children}</div>
      <div className="justify-self-end">{action}</div>
    </div>
  );
}

function EditableRow({ label, value, type = "text", options }) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(value);
  const [draft, setDraft] = useState(value);

  const save = () => {
    setCurrent(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(current);
    setEditing(false);
  };

  const display =
    type === "date"
      ? new Date(current).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : current;

  return (
    <Row
      label={label}
      action={
        !editing && (
          <Button
            variant="secondary"
            onClick={() => setEditing(true)}
            className={"w-fit p-2 py-1 shadow-none"}
          >
            <Pencil className="h-3 w-3" /> Edit
          </Button>
        )
      }
    >
      {editing ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          {options ? (
            <select
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className={inputCls}
            >
              {options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className={inputCls}
            />
          )}
          <div className="flex gap-2">
            <Button onClick={save} className="Shadow-none py-1 w-fit">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={cancel}
              className="Shadow-none py-1 w-fit"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        display
      )}
    </Row>
  );
}

// Phone row with a country code select + number input.
function PhoneRow({ label, value }) {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState(parsePhone(value));
  const [draft, setDraft] = useState(current);

  const save = () => {
    setCurrent(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(current);
    setEditing(false);
  };

  return (
    <Row
      label={label}
      action={
        !editing && (
          <Button
            variant="secondary"
            onClick={() => setEditing(true)}
            className={"w-fit p-2 py-1 shadow-none"}
          >
            <Pencil className="h-3 w-3" /> Edit
          </Button>
        )
      }
    >
      {editing ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex w-full gap-2">
            <select
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value })}
              className={`${inputCls} !w-28 shrink-0`}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              inputMode="numeric"
              value={draft.number}
              placeholder="10-digit number"
              onChange={(e) =>
                setDraft({
                  ...draft,
                  number: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              className={inputCls}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="Shadow-none py-1 w-fit">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={cancel}
              className="Shadow-none py-1 w-fit"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : current.number ? (
        `${current.code} ${current.number}`
      ) : (
        "Not Assigned"
      )}
    </Row>
  );
}

/* ---------- page ---------- */
export default function PersonalInfo() {
  const { user } = useSelector((state) => state.auth);
  const initial = user.firstName.charAt(0).toUpperCase();
  const navigate = useNavigate();

  return (
    <div style={THEME_VARS} className="min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />
      <div className="mx-auto max-w-6xl pb-20 pt-4">
        {/* breadcrumb */}
        <div className="grid gap-12 lg:grid-cols-[280px_1fr] relative">
          <div className="absolute top-1 left-0 w-fit">
            {/* back */}
            <BackButtonUser variant="secondary" />
          </div>

          {/* ---------- sidebar ---------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start mt-16 flex items-center justify-center">
            <FormCard className="flex items-center justify-center gap-4 border lg:flex-col w-fit lg:text-center">
              <div className="relative h-20 w-20 shrink-0 lg:h-28 lg:w-28">
                <div className="grid h-full w-full p-1 place-items-center rounded-full border-2 text-3xl font-bold lg:text-5xl">
                  {user?.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <Button
                  aria-label="Change photo"
                  className="absolute bottom-0 right-0 w-fit place-items-center rounded-full "
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-sm text-neutral-500">
                  {user.email}
                </p>
              </div>
              <div className="w-fit lg:w-full">
                <Button
                  className=""
                  onClick={() => navigate("/user/profile/seller-register")}
                >
                  <HandCoins />{" "}
                  <span className="lg:block hidden">Become a seller</span>
                </Button>
              </div>
            </FormCard>
          </aside>

          {/* ---------- content ---------- */}
          <main className="space-y-6 mt-6">
            <header>
              <h1 className="text-3xl font-bold tracking-tight">
                Personal Info
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Keep your details up to date so deliveries and offers always
                reach you.
              </p>
            </header>

            <Group title="Basic details">
              <EditableRow label="First name" value={user.firstName} />
              <EditableRow label="Last name" value={user.lastName} />
              <EditableRow
                label="Date of birth"
                value={user.dateOfBirth}
                type="date"
              />
              <EditableRow
                label="Gender"
                value={user.gender}
                options={["Male", "Female"]}
              />
            </Group>

            <Group title="Contact" hint="We use these to send order updates.">
              <EditableRow label="Email" value={user.email} type="email" />
              <PhoneRow label="Phone" value={user?.phone} />
            </Group>

            <Group title="Account">
              <Row label="Account type">{user.role}</Row>
            </Group>
            <Button>Save Changes</Button>
          </main>
        </div>
      </div>
    </div>
  );
}
