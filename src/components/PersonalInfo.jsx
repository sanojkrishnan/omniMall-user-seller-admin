import { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Camera, Pencil, HandCoins } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormCard } from "./ui/FormCard";
import { Button } from "./ui/Button";
import BackButtonUser from "./ui/BackButtonUser";
import DataTable from "./ui/DataTable";
import { FieldLabel, renderField } from "./ui/EditFields";
import { inputBase } from "../utils/inputBase";
import { handleImage } from "../utils/imageCompressor";
import { userSchema } from "../validation/userSchema";
import { updateProfile } from "../redux/slice/authSlice";
import { toast } from "react-toastify";
import { singleSellerFetch } from "../redux/slice/sellerSlice";
import Loading from "./ui/Loading";
import { useToastError } from "../hooks/useToastError";

// CSS variables FieldLabel / renderField read (same ones CreatePanel sets on its wrapper).

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

/* ---------- schema: reuse userSchema, add the phone fields ---------- */

const personalSchema = userSchema
  .pick([
    "firstName",
    "lastName",
    "email",
    "dateOfBirth",
    "gender",
    "profileImage",
  ])

  .concat(
    Yup.object({
      phoneCode: Yup.string(),
      phoneNumber: Yup.string().matches(/^(\d{10})?$/, "Enter 10 digits"),
    }),
  );

/* ---------- field configs for renderField ---------- */

const FIELDS = {
  firstName: { name: "firstName", type: "text", placeholder: "First name" },
  lastName: { name: "lastName", type: "text", placeholder: "Last name" },
  dateOfBirth: { name: "dateOfBirth", type: "date" },
  gender: {
    name: "gender",
    type: "select",
    options: [
      { label: "Male", value: "male" }, // lowercase value = what userSchema allows
      { label: "Female", value: "female" },
    ],
  },
  email: { name: "email", type: "email", placeholder: "you@example.com" },
};

const PHONE_CODE_FIELD = {
  name: "phoneCode",
  type: "select",
  options: COUNTRY_CODES.map((c) => ({ label: c.label, value: c.code })),
};

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const formatDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const formatGender = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "—");

// Preview for a File (new pick) or { url } (existing photo)

function usePreview(value) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (value instanceof Blob) {
      const u = URL.createObjectURL(value);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }

    setUrl(value?.url ?? null);
  }, [value]);

  return url;
}

// Focus + select the input when a cell enters edit mode, and make
// Enter = Done, Escape = Cancel (so Enter never submits the form).

function useEditKeys(
  editing,
  { done, cancel, selector = "input, select, textarea" },
) {
  const ref = useRef(null);

  useEffect(() => {
    if (!editing) return;

    const el = ref.current?.querySelector(selector);
    if (!el) return;

    el.focus();

    try {
      el.select?.(); // selects the existing text; selects/date inputs ignore it
    } catch {
      /* some input types don't support select() */
    }
  }, [editing, selector]);

  const onKeyDown = (e) => {
    if (e.target.closest("button")) return; // let Done/Cancel buttons behave normally

    if (e.key === "Enter") {
      e.preventDefault(); // stops the implicit form submit
      done();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return { ref, onKeyDown };
}

/* ---------- cells ---------- */

function EditButton({ onClick }) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={onClick}
      className="w-fit p-2 py-1 shadow-none"
    >
      <Pencil className="h-3 w-3" /> Edit
    </Button>
  );
}

function EditBar({ onDone, onCancel }) {
  return (
    <div className="flex gap-2">
      <Button type="button" onClick={onDone} className="shadow-none py-1 w-fit">
        Done
      </Button>

      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        className="shadow-none py-1 w-fit"
      >
        Cancel
      </Button>
    </div>
  );
}

function EditableCell({ field, formik, format }) {
  const { name } = field;

  const [editing, setEditing] = useState(false);

  const snapshot = useRef(null);

  const start = () => {
    snapshot.current = formik.values[name];

    setEditing(true);
  };

  const done = async () => {
    formik.setFieldTouched(name, true, false);

    const errors = await formik.validateForm();

    if (errors[name]) return; // stay open while invalid

    setEditing(false);
  };

  const cancel = () => {
    formik.setFieldValue(name, snapshot.current);

    formik.setFieldTouched(name, false, false);

    setEditing(false);
  };

  const { ref, onKeyDown } = useEditKeys(editing, { done, cancel });

  if (!editing) {
    const raw = formik.values[name];

    return (
      <div className="flex items-center justify-between gap-4 text-sm font-medium">
        <span className="min-w-0 truncate">
          {format ? format(raw) : raw || "—"}
        </span>

        <EditButton onClick={start} />
      </div>
    );
  }

  return (
    <div ref={ref} onKeyDown={onKeyDown}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">{renderField(field, formik)}</div>

        <EditBar onDone={done} onCancel={cancel} />
      </div>
    </div>
  );
}

function PhoneCell({ formik }) {
  const [editing, setEditing] = useState(false);

  const snapshot = useRef(null);

  const { phoneCode, phoneNumber } = formik.values;

  const start = () => {
    snapshot.current = { phoneCode, phoneNumber };

    setEditing(true);
  };

  const done = async () => {
    formik.setFieldTouched("phoneNumber", true, false);
    const errors = await formik.validateForm();

    if (errors.phoneNumber) return;

    setEditing(false);
  };

  const cancel = () => {
    formik.setValues({ ...formik.values, ...snapshot.current });

    formik.setFieldTouched("phoneNumber", false, false);

    setEditing(false);
  };

  // the first control is the country-code select, so focus the number input
  const { ref, onKeyDown } = useEditKeys(editing, {
    done,
    cancel,
    selector: 'input[name="phoneNumber"]',
  });

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-4 text-sm font-medium">
        <span>
          {phoneNumber ? `${phoneCode} ${phoneNumber}` : "Not Assigned"}
        </span>

        <EditButton onClick={start} />
      </div>
    );
  }

  return (
    <div ref={ref} onKeyDown={onKeyDown}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 gap-2">
          <div className="w-32 shrink-0">
            {renderField(PHONE_CODE_FIELD, formik)}
          </div>

          <input
            type="tel"
            inputMode="numeric"
            name="phoneNumber"
            placeholder="10-digit number"
            value={phoneNumber}
            onChange={(e) =>
              formik.setFieldValue(
                "phoneNumber",

                e.target.value.replace(/\D/g, "").slice(0, 10),
              )
            }
            onBlur={formik.handleBlur}
            className={inputBase}
          />
        </div>

        <EditBar onDone={done} onCancel={cancel} />
      </div>
    </div>
  );
}

function InfoTable({ title, hint, data, columns }) {
  return (
    <section className="border rounded-xl overflow-hidden shadow-md">
      {hint && <p className="border-b px-5 py-2 text-xs">{hint}</p>}

      <DataTable
        title={title}
        columns={columns}
        data={data}
        striped={false}
        hover={false}
      />
    </section>
  );
}

/* ---------- page ---------- */

export default function PersonalInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wasUpdating = useRef(false);
  const photoInput = useRef(null);
  const [requested, setRequested] = useState(false);

  const { user, userUpdating, userUpdateError, message } = useSelector(
    (state) => state.auth,
  );

  const { seller, isSellerLoading, sellerError, sellerMessage } = useSelector(
    (state) => state.seller,
  );

  const sellerBusy = isSellerLoading;
  const sellerCame = !isSellerLoading && !!seller?.storeName;
  const sellerCrash = !isSellerLoading && !seller && sellerError;

  useToastError({
    errorMessage: requested && !isSellerLoading ? sellerError : null,
    fallbackErrorMessage: "Failed to load addresses",
  });
  //seller fetch
  useEffect(() => {
    dispatch(singleSellerFetch());
    setRequested(true);
  }, [dispatch]);

  const initialValues = useMemo(() => {
    const { code, number } = parsePhone(user.phone);

    return {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      dateOfBirth: toDateInput(user.dateOfBirth),
      gender: (user.gender ?? "male").toLowerCase(),
      profileImage: user.profileImage ?? null, // {url} or later a File
      phoneCode: code,
      phoneNumber: number,
    };
  }, [user]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // after a successful save the form resets to the new user
    validationSchema: personalSchema,
    validateOnMount: true,

    onSubmit: (values) => {
      // keep only the fields the user actually changed
      const changed = {};
      for (const key of Object.keys(values)) {
        if (values[key] !== initialValues[key]) changed[key] = values[key];
      }

      // phone is stored as one string, so merge code + number when either changed
      if ("phoneCode" in changed || "phoneNumber" in changed) {
        changed.phone = values.phoneNumber
          ? `${values.phoneCode}${values.phoneNumber}`
          : "";
        delete changed.phoneCode;
        delete changed.phoneNumber;
      }

      const { profileImage, ...fields } = changed;

      let payload = fields;

      // Only a newly picked photo is sent. The existing { url } object is
      // not a file, so it never goes to the backend.
      if (profileImage instanceof File) {
        payload = new FormData();
        Object.entries(fields).forEach(([k, v]) => payload.append(k, v ?? ""));
        payload.append("profileImage", profileImage);
      }

      // result is handled by the effect below (toast + reset on failure)
      dispatch(updateProfile(payload));
    },
  });

  // Toast when a save finishes; on backend failure drop all edits.
  // Must sit below useFormik because it uses `formik`.
  useEffect(() => {
    if (wasUpdating.current && !userUpdating) {
      if (userUpdateError) {
        toast.error(userUpdateError);
        formik.resetForm();
      } else {
        toast.success(message);
      }
    }
    wasUpdating.current = userUpdating;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userUpdating, userUpdateError]);

  const photo = usePreview(formik.values.profileImage);
  const initial = (formik.values.firstName || "?").charAt(0).toUpperCase();
  async function handlePhotoPick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const res = await handleImage(file, "profile"); // use an imageType your util supports
      const f =
        res instanceof File
          ? res
          : new File([res], file.name, { type: res.type || file.type });
      formik.setFieldValue("profileImage", f); // userSchema's size/type tests run here
      formik.setFieldTouched("profileImage", true, false);
    } catch {
      formik.setFieldError("profileImage", "Could not process this image");
    }
  }

  // Show all validation messages together in the shared error panel.
  // Before the first submit, show errors for fields the user has interacted with.
  // After a submit attempt, show every validation error, including untouched fields.
  const validationErrors = [
    ...new Set(
      Object.keys(formik.errors)
        .filter((field) => formik.submitCount > 0 || formik.touched[field])
        .map((field) => formik.errors[field])
        .filter(Boolean),
    ),
  ];

  const columns = [
    {
      header: "Field",
      headerClassName:
        "w-1/3 text-xs uppercase tracking-widest text-neutral-500",
      cellClassName: "w-1/3 align-middle",
      render: (row) => <FieldLabel>{row.label}</FieldLabel>,
    },

    {
      header: "Details",
      headerClassName: "text-xs uppercase tracking-widest text-neutral-500",
      cellClassName: "align-middle",
      render: (row) =>
        row.kind === "phone" ? (
          <PhoneCell formik={formik} />
        ) : row.kind === "static" ? (
          <span className="text-sm font-medium">{row.value}</span>
        ) : (
          <EditableCell field={row.field} formik={formik} format={row.format} />
        ),
    },
  ];

  const basicDetails = [
    { _id: "firstName", label: "First name", field: FIELDS.firstName },
    { _id: "lastName", label: "Last name", field: FIELDS.lastName },
    {
      _id: "dob",
      label: "Date of birth",
      field: FIELDS.dateOfBirth,
      format: formatDate,
    },
    {
      _id: "gender",
      label: "Gender",
      field: FIELDS.gender,
      format: formatGender,
    },
  ];

  // const contact = [
  //   { _id: "email", label: "Email", field: FIELDS.email },

  //   { _id: "phone", label: "Phone", kind: "phone" },
  // ];

  const account = [
    { _id: "role", label: "Account type", value: user.role, kind: "static" },
  ];

  return (
    <div style={THEME_VARS} className="min-h-screen bg-white text-black">
      <div className="h-20 w-full" />

      <div className="mx-auto max-w-6xl pb-20 pt-4">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr] relative">
          <div className="absolute top-1 left-0 w-fit">
            <BackButtonUser variant="secondary" />
          </div>

          {/* ---------- sidebar ---------- */}

          <aside className="lg:sticky lg:top-24 lg:self-start mt-16 flex items-center justify-center">
            <FormCard className="flex items-center justify-center gap-4 border lg:flex-col w-fit lg:text-center">
              <div>
                <div className="relative h-20 w-20 shrink-0 lg:h-28 lg:w-28">
                  <div className="grid h-full w-full p-1 place-items-center rounded-full border-2 text-3xl font-bold lg:text-5xl">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      initial
                    )}
                  </div>

                  <Button
                    type="button"
                    aria-label="Change photo"
                    onClick={() => photoInput.current?.click()}
                    className="absolute bottom-0 right-0 w-fit place-items-center rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>

                  <input
                    ref={photoInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoPick}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-bold">
                  {user.firstName} {user.lastName}
                </p>

                <p className="truncate text-sm text-neutral-500">
                  {user.email}
                </p>
              </div>

              <div className="w-full">
                <Button
                  variant={sellerCame ? "primary" : "secondary"}
                  disabled={sellerBusy || sellerCrash}
                  type="button"
                  onClick={() => {
                    if (sellerCame) {
                      navigate("/seller", { replace: true });
                      toast.success(sellerMessage);
                    } else {
                      navigate("/user/profile/seller-register");
                    }
                  }}
                >
                  {sellerBusy ? (
                    <Loading className="size-6" />
                  ) : (
                    <>
                      {sellerCame ? (
                        <HandCoins />
                      ) : sellerCrash ? (
                        ""
                      ) : (
                        <HandCoins />
                      )}
                      <span>
                        {sellerCame
                          ? "Go to seller dashboard"
                          : sellerCrash
                            ? "404"
                            : "Become a seller"}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </FormCard>
          </aside>

          {/* ---------- content ---------- */}

          <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
            <header>
              <h1 className="text-3xl font-bold tracking-tight">
                Personal Info
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Keep your details up to date so deliveries and offers always
                reach you.
              </p>
            </header>

            <InfoTable
              title="Basic details"
              data={basicDetails}
              columns={columns}
            />

            {/* <InfoTable
              title="Contact"
              hint="We use these to send order updates."
              data={contact}
              columns={columns}
            /> */}

            <InfoTable title="Account" data={account} columns={columns} />
            {validationErrors.length > 0 && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <p className="mb-2 text-sm font-semibold text-red-700">
                  Please fix the following errors:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                  {validationErrors.map((error, index) => (
                    <li key={`${error}-${index}`}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button type="submit" disabled={!formik.dirty || userUpdating}>
              {userUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
