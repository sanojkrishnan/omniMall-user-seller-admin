import { useState } from "react";
import * as Yup from "yup";
import {
  Mail,
  KeyRound,
  ShieldCheck,
  Bell,
  Laptop,
  Smartphone,
  LogOut,
  Trash2,
} from "lucide-react";
import BackButtonUser from "./ui/BackButtonUser";
import { EditPanel } from "./ui/EditPanel";
import ConfirmProvider from "./ui/ConfirmProvider";
import ToggleSwitch from "./ui/ToggleSwitch";

/* ---------- static data ---------- */
const email = "aarav.menon@example.com";

const initialDevices = [
  {
    id: 1,
    name: "Chrome on Windows",
    kind: "laptop",
    location: "Kochi, India",
    last: "Active now",
    current: true,
  },
  {
    id: 2,
    name: "OmniMall app on Android",
    kind: "phone",
    location: "Palakkad, India",
    last: "2 hours ago",
  },
  {
    id: 3,
    name: "Firefox on Linux",
    kind: "laptop",
    location: "Bengaluru, India",
    last: "5 days ago",
  },
];

/* ---------- change password panel config ---------- */
const PASSWORD_FIELDS = [
  {
    name: "currentPassword",
    label: "Current password",
    type: "password",
    span: "full",
    required: true,
    autoComplete: "current-password",
  },
  {
    name: "newPassword",
    label: "New password",
    type: "password",
    span: "full",
    required: true,
    helperText:
      "At least 8 characters with a capital letter, a number and a symbol.",
  },
  {
    name: "confirmPassword",
    label: "Confirm new password",
    type: "password",
    span: "full",
    required: true,
  },
];

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Enter your current password"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number")
    .matches(/[!@#$%^&*]/, "Include at least one special character")
    .notOneOf([Yup.ref("currentPassword")], "New password must be different")
    .required("Enter a new password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm your new password"),
});

/* ---------- small pieces ---------- */
function Section({ title, hint, children }) {
  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-widest">{title}</h2>
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
      <div className="mt-4 divide-y divide-black/10 rounded-2xl border border-black/15 bg-white">
        {children}
      </div>
    </section>
  );
}

function Row({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex items-center gap-4 p-5 sm:px-6">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {desc && (
          <p className="mt-0.5 break-words text-xs text-neutral-500">{desc}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const pillBtn =
  "flex items-center gap-1.5 rounded-full border border-black px-4 py-1.5 text-xs font-semibold transition hover:bg-black hover:text-white";

/* ---------- page ---------- */
export default function LoginSecurity() {
  const [twoStep, setTwoStep] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [devices, setDevices] = useState(initialDevices);
  const [passwordChanged, setPasswordChanged] = useState("3 months ago");
  const [passwordOpen, setPasswordOpen] = useState(false);

  // one confirmation dialog shared by every risky action on this page
  const [confirm, setConfirm] = useState({
    open: false,
    message: "",
    run: null,
  });
  const askConfirm = (message, run) => setConfirm({ open: true, message, run });
  const handleConfirmResult = (confirmed) => {
    setConfirm((c) => ({ ...c, open: false }));
    if (confirmed) confirm.run?.();
  };

  const otherDevices = devices.filter((d) => !d.current);

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* spacer for the fixed navbar */}
      <div className="h-20 w-full" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-1 sm:px-6">
        <BackButtonUser variant="secondary" />

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Login &amp; Security
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Keep your OmniMall account safe and in your control.
          </p>
        </header>

        <div className="space-y-10">
          <Section title="Sign in">
            <Row icon={Mail} title="Login email" desc={email} />
            <Row
              icon={KeyRound}
              title="Password"
              desc={`Last changed ${passwordChanged}`}
            >
              <button onClick={() => setPasswordOpen(true)} className={pillBtn}>
                Change
              </button>
            </Row>
          </Section>

          <Section title="Protection">
            <Row
              icon={ShieldCheck}
              title="Two-step verification"
              desc="Ask for a one-time code when you sign in on a new device."
            >
              <ToggleSwitch
                checked={twoStep}
                onChange={(checked) =>
                  checked
                    ? setTwoStep(true)
                    : askConfirm(
                        "Turn off two-step verification? Your account will be less protected.",
                        () => setTwoStep(false),
                      )
                }
              />
            </Row>
            <Row
              icon={Bell}
              title="Login alerts"
              desc="Email me when someone signs in from a new device."
            >
              <ToggleSwitch
                checked={loginAlerts}
                onChange={(c) => setLoginAlerts(c)}
              />
            </Row>
          </Section>

          <Section
            title="Where you're signed in"
            hint="If you don't recognise a device, log it out and change your password."
          >
            {devices.map((d) => {
              const Icon = d.kind === "phone" ? Smartphone : Laptop;
              return (
                <Row
                  key={d.id}
                  icon={Icon}
                  title={
                    d.current ? (
                      <span className="flex flex-wrap items-center gap-2">
                        {d.name}
                        <span className="rounded-full bg-black px-2.5 py-0.5 text-[11px] font-semibold text-white">
                          This device
                        </span>
                      </span>
                    ) : (
                      d.name
                    )
                  }
                  desc={`${d.location} · ${d.last}`}
                >
                  {!d.current && (
                    <button
                      onClick={() =>
                        askConfirm(`Log out of ${d.name}?`, () =>
                          setDevices((list) =>
                            list.filter((x) => x.id !== d.id),
                          ),
                        )
                      }
                      className={pillBtn}
                    >
                      <LogOut className="h-3 w-3" /> Log out
                    </button>
                  )}
                </Row>
              );
            })}
            {otherDevices.length > 0 && (
              <div className="p-5 sm:px-6">
                <button
                  onClick={() =>
                    askConfirm("Log out of all other devices?", () =>
                      setDevices((list) => list.filter((d) => d.current)),
                    )
                  }
                  className="text-xs font-semibold underline underline-offset-4 hover:opacity-60"
                >
                  Log out of all other devices
                </button>
              </div>
            )}
          </Section>

          <Section title="Danger zone">
            <Row
              icon={Trash2}
              title="Delete account"
              desc="Permanently remove your account, orders history and saved details."
            >
              <button
                onClick={() =>
                  askConfirm(
                    "Delete your account permanently? This can't be undone.",
                    () => {
                      /* TODO: call your delete-account API */
                    },
                  )
                }
                className={pillBtn}
              >
                Delete
              </button>
            </Row>
          </Section>
        </div>
      </main>

      <EditPanel
        variant="user"
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Change password"
        subtitle="You'll stay signed in on this device."
        fields={PASSWORD_FIELDS}
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={passwordSchema}
        submitLabel="Update password"
        onSubmit={() => {
          // TODO: call your change-password API
          setPasswordChanged("just now");
          setPasswordOpen(false);
        }}
      />

      <ConfirmProvider
        variant="user"
        open={confirm.open}
        setOpen={(open) => setConfirm((c) => ({ ...c, open }))}
        onResult={handleConfirmResult}
      >
        {confirm.message}
      </ConfirmProvider>
    </div>
  );
}
