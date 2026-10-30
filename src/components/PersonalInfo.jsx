import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Pencil, HandCoins } from "lucide-react";
import { FormCard } from "./ui/FormCard";
import { Button } from "./ui/Button";
import { GoSignOut } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import ConfirmProvider from "./ui/ConfirmProvider";

/* ---------- small pieces ---------- */
const inputCls =
  "w-full border border-black bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10";

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
      <p className="col-span-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:col-span-1">
        {label}
      </p>
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
            <button
              onClick={save}
              className="bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
            >
              Save
            </button>
            <button
              onClick={cancel}
              className="border border-black px-4 py-2 text-xs font-semibold transition hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        display
      )}
    </Row>
  );
}

/* ---------- page ---------- */
export default function PersonalInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const initial = user.firstName.charAt(0).toUpperCase();

  function handleResult(confirmed) {
    setOpen(false);
    if (confirmed) {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-4 sm:pt-8">
        {/* breadcrumb */}

        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          {/* ---------- sidebar ---------- */}
          {/* <BackButtonUser onClick={() => navigate(-1)} /> */}
          <aside className="lg:sticky lg:top-24 lg:self-start mt-10 flex items-center justify-center">
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
                <Button className="">
                  <HandCoins />{" "}
                  <span className="lg:block hidden">Become a seller</span>
                </Button>
                <Button
                  variant="secondary"
                  className={"text-red-500"}
                  onClick={() => {
                    setOpen((prev) => !prev);
                  }}
                >
                  <GoSignOut /> <span className="lg:block hidden">LogOut</span>
                </Button>
              </div>
            </FormCard>
          </aside>

          {/* ---------- content ---------- */}
          <main className="space-y-6">
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
              <EditableRow
                label="Email"
                value={user.email}
                type="email"
              ></EditableRow>
              <EditableRow
                label="Phone"
                value={user?.phone || "Not Assigned"}
                type="tel"
              />
            </Group>

            <Group title="Account">
              <Row label="Account type">{user.role}</Row>
            </Group>
          </main>
        </div>
      </div>

      <ConfirmProvider
        open={open}
        onResult={handleResult}
        setOpen={setOpen}
      >
        {" "}
        Are you sure, you want to log out from Omnimall?
      </ConfirmProvider>
    </div>
  );
}
