import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "../lib/cn"; // adjust this import to wherever your `cn` (clsx + twMerge) helper lives
import { Button } from "./ui/Button";

// Two distinct visual identities, not just a recolored accent.
// admin: warm maroon/cream, matching the existing admin screens.
// user: cool navy/slate, for anything shown to a shopper (profile, etc).
const THEMES = {
  admin: {
    text: "#241a1a",
    muted: "#8a7873",
    border: "#e8e1df",
    soft: "#faf7f6",
    accent: "#5f0000",
    accentSoft: "#f3e9e8",
    danger: "#b3261e",
  },
  user: {
    text: "#black",
    muted: "#748094",
    border: "#dde3ea",
    soft: "#f4f6f9",
    accent: "#black",
    accentSoft: "#e7edf3",
    danger: "#b3261e",
  },
};

const inputBase =
  "w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none transition-colors " +
  "border-[var(--edit-border)] text-[var(--edit-text)] placeholder:text-[var(--edit-muted)] " +
  "focus:border-[var(--edit-accent)] focus:ring-2 focus:ring-[var(--edit-accent-soft)]";

// Builds a Yup shape from the `fields` schema so every entity (product,
// coupon, category, profile...) gets sensible validation for free.
// Pass `field.validation` (a Yup schema) to override a single field, or
// pass `validationSchema` on EditPanel itself to override everything.
function buildValidationSchema(fields) {
  const shape = {};
  fields.forEach((field) => {
    if (field.validation) {
      shape[field.name] = field.validation;
      return;
    }

    let rule;
    switch (field.type) {
      case "number":
        rule = Yup.number().typeError(`${field.label} must be a number`);
        break;
      case "toggle":
        rule = Yup.boolean();
        break;
      case "image":
        rule = Yup.mixed();
        break;
      default:
        rule = Yup.string();
    }

    if (field.required) {
      rule = rule.required(`${field.label} is required`);
    }

    shape[field.name] = rule;
  });
  return Yup.object().shape(shape);
}

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--edit-muted)]">
      {children}
      {required && <span className="text-[var(--edit-danger)]">*</span>}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[12px] text-[var(--edit-danger)]">{message}</p>
  );
}

function ImageField({ field, value, onChange }) {
  const inputRef = useRef(null);
  const preview =
    typeof value === "string" ? value : (value?.previewUrl ?? null);

  function handlePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange({ file, previewUrl: URL.createObjectURL(file) });
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
          "border-[var(--edit-border)] bg-[var(--edit-soft)]",
        )}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[10px] text-[var(--edit-muted)]">No image</span>
        )}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        className="border-[var(--edit-border)] text-[var(--edit-text)]"
      >
        {preview ? "Replace" : "Upload"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={field.accept ?? "image/*"}
        className="hidden"
        onChange={handlePick}
      />
    </div>
  );
}

function renderField(field, formik) {
  const value = formik.values[field.name];

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          name={field.name}
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
          value={value ?? ""}
          disabled={field.disabled}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(inputBase, "resize-none")}
        />
      );

    case "select":
      return (
        <select
          name={field.name}
          value={value ?? ""}
          disabled={field.disabled}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(inputBase, "appearance-none")}
        >
          <option value="" disabled>
            {field.placeholder ?? "Select an option"}
          </option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "toggle":
      return (
        <button
          type="button"
          disabled={field.disabled}
          onClick={() => {
            formik.setFieldValue(field.name, !value);
            formik.setFieldTouched(field.name, true);
          }}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            value ? "bg-[var(--edit-accent)]" : "bg-[var(--edit-border)]",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              value ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </button>
      );

    case "image":
      return (
        <ImageField
          field={field}
          value={value}
          onChange={(val) => {
            formik.setFieldValue(field.name, val);
            formik.setFieldTouched(field.name, true);
          }}
        />
      );

    case "number":
      return (
        <input
          type="number"
          name={field.name}
          placeholder={field.placeholder}
          value={value ?? ""}
          disabled={field.disabled}
          min={field.min}
          max={field.max}
          step={field.step ?? "any"}
          onChange={(e) =>
            formik.setFieldValue(field.name, e.target.valueAsNumber || "")
          }
          onBlur={formik.handleBlur}
          className={cn(inputBase, "font-mono")}
        />
      );

    case "date":
      return (
        <input
          type="date"
          name={field.name}
          value={value ?? ""}
          disabled={field.disabled}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(inputBase, "font-mono")}
        />
      );

    default:
      return (
        <input
          type="text"
          name={field.name}
          placeholder={field.placeholder}
          value={value ?? ""}
          disabled={field.disabled}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputBase}
        />
      );
  }
}

/**
 * EditPanel — a Formik + Yup driven edit form usable for any entity
 * (product, coupon, category, user profile, ...).
 *
 * <EditPanel
 *   variant="admin" | "user"
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Edit product"
 *   fields={[
 *     { name: "productName", label: "Product name", type: "text", required: true },
 *     { name: "productDesc", label: "Description", type: "textarea", span: "full" },
 *     { name: "mrp", label: "MRP", type: "number", required: true },
 *     { name: "categoryId", label: "Category", type: "select", options: categoryOptions },
 *     { name: "productImage", label: "Image", type: "image", span: "full" },
 *   ]}
 *   initialValues={singleProduct}
 *   onSubmit={(values) => dispatch(updateProduct(values))}
 *   // optional: validationSchema={Yup.object({ ... })} to override entirely
 * />
 */
export default function EditPanel({
  variant = "admin",
  open,
  onClose,
  title,
  subtitle,
  fields = [],
  initialValues = {},
  onSubmit,
  validationSchema,
  submitLabel = "Save changes",
  cancelLabel = "Cancel",
  isSubmitting,
  error,
}) {
  const theme = THEMES[variant] ?? THEMES.admin;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: validationSchema ?? buildValidationSchema(fields),
    onSubmit: (values) => onSubmit?.(values),
  });

  // Reset to a clean state each time the panel opens, rather than on
  // every initialValues reference change (enableReinitialize alone
  // would re-sync on every parent re-render while open).
  useEffect(() => {
    if (open) {
      formik.resetForm({ values: initialValues });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const submitting = isSubmitting ?? formik.isSubmitting;

  return (
    <div
      style={{
        "--edit-text": theme.text,
        "--edit-muted": theme.muted,
        "--edit-border": theme.border,
        "--edit-soft": theme.soft,
        "--edit-accent": theme.accent,
        "--edit-accent-soft": theme.accentSoft,
        "--edit-danger": theme.danger,
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-lg rounded-xl border border-[var(--edit-border)] bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--edit-border)] px-6 py-5">
          <div>
            <h2 className="font-sans text-[18px] font-semibold text-[var(--edit-text)]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-[13px] text-[var(--edit-muted)]">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-[var(--edit-muted)] hover:text-[var(--edit-text)]"
          >
            Close
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto px-6 py-5">
            {fields.map((field) => (
              <div
                key={field.name}
                className={cn(field.span === "full" && "col-span-2")}
              >
                <FieldLabel required={field.required}>{field.label}</FieldLabel>
                {renderField(field, formik)}
                {field.helperText &&
                  !(
                    formik.touched[field.name] && formik.errors[field.name]
                  ) && (
                    <p className="mt-1 text-[12px] text-[var(--edit-muted)]">
                      {field.helperText}
                    </p>
                  )}
                <FieldError
                  message={
                    formik.touched[field.name]
                      ? formik.errors[field.name]
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="mx-6 mb-4 rounded-lg bg-[var(--edit-danger)]/10 px-3 py-2 text-[13px] text-[var(--edit-danger)]">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-[var(--edit-border)] px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="border-[var(--edit-border)] text-[var(--edit-text)]"
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className={cn(
                "border text-white",
                "border-[var(--edit-accent)] bg-[var(--edit-accent)]",
                submitting && "opacity-60",
              )}
            >
              {submitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
