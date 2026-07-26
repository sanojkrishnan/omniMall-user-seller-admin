import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "../../utils/CN";
import { Button } from "./Button";
import { FormCard } from "./FormCard";
import { TriangleAlert } from "lucide-react";

const THEMES = {
  admin: {
    text: "black",
    muted: "black",
    border: "#e8e1df",
    soft: "#faf7f6",
    accent: "#5f0000",
    accentSoft: "#f3e9e8",
    danger: "#b3261e",
  },
  user: {
    text: "black",
    muted: "black",
    border: "#dde3ea",
    soft: "#f4f6f9",
    accent: "black",
    accentSoft: "#e7edf3",
    danger: "#b3261e",
  },
};

const inputBase =
  "w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none transition-colors " +
  "border-[var(--edit-border)] text-[var(--edit-text)] placeholder:text-[var(--edit-muted)] " +
  "focus:border-[var(--edit-accent)] focus:ring-2 focus:ring-[var(--edit-accent-soft)]";

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
        rule = Yup.number()
          .typeError(`${field.label} must be a number`)
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value,
          );
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
    <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
      <TriangleAlert className="size-3 text-red-500" />
      {message}
    </p>
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

export function EditPanel({
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
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: validationSchema ?? buildValidationSchema(fields),
    onSubmit: (values) => onSubmit?.(values),
  });

  useEffect(() => {
    let rafId;
    let timeoutId;

    if (open) {
      setShouldRender(true);
      formik.resetForm({ values: initialValues });
      // Mount first at the "closed" visual state (isVisible still false),
      // then flip to "open" on a later frame so the browser actually
      // paints the closed state before transitioning to open. A single
      // rAF is sometimes coalesced into the same paint as the mount, so
      // we nest two.
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      timeoutId = setTimeout(() => setShouldRender(false), 300); // match duration-300
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!shouldRender) return null;
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
      className={`${isVisible ? "opacity-100" : "opacity-0"} duration-300 transition-opacity fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <FormCard
        className={`${isVisible ? "scale-100" : "scale-0"} duration-300 transition-transform`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black px-6 py-5">
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
          <div className="grid max-h-[40vh] overflow-y-auto custom-scrollbar grid-cols-2 gap-4 px-6 py-5">
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
            <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-[var(--edit-danger)]/10 px-3 py-2 text-[13px] text-red-500">
              <TriangleAlert className="size-3 text-red-500" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-black px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className=" text-[var(--edit-text)]"
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
      </FormCard>
    </div>
  );
}
