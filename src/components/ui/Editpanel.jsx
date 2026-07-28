import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { cn } from "../../utils/CN";
import { Button } from "./Button";
import { FormCard } from "./FormCard";
import { TriangleAlert } from "lucide-react";
import buildValidationSchema from "../../validation/editValidayionSchema";
import { FieldError, FieldLabel, renderField } from "./EditFields";

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
