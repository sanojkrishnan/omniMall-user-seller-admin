import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "../../utils/CN";
import { Button } from "./Button";
import { FormCard } from "./FormCard";
import { TriangleAlert, ChevronDown, Eye, EyeOff, X } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { createPortal } from "react-dom";

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
      case "range":
        rule = Yup.number()
          .typeError(`${field.label} must be a number`)
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value,
          );
        break;
      case "toggle":
      case "checkbox":
        rule = Yup.boolean();
        break;
      case "multiselect":
      case "checkbox-group":
      case "tags":
        rule = Yup.array();
        break;
      case "email":
        rule = Yup.string().email(`${field.label} must be a valid email`);
        break;
      case "url":
        rule = Yup.string().url(`${field.label} must be a valid URL`);
        break;
      case "image":
      case "file":
        rule = Yup.mixed();
        break;
      default:
        rule = Yup.string();
    }

    if (field.required) {
      rule =
        field.type === "multiselect" ||
        field.type === "checkbox-group" ||
        field.type === "tags"
          ? rule.min(1, `${field.label} is required`)
          : rule.required(`${field.label} is required`);
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

function FileField({ field, value, onChange }) {
  const inputRef = useRef(null);
  const fileName =
    value?.file?.name ??
    (Array.isArray(value) ? value.map((f) => f.name).join(", ") : null) ??
    (typeof value === "string" ? value : null);

  function handlePick(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onChange(field.multiple ? Array.from(files) : { file: files[0] });
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex-1 truncate rounded-lg border border-dashed px-3 py-2 text-[13px]",
          "border-[var(--edit-border)] text-[var(--edit-muted)]",
        )}
      >
        {fileName || "No file selected"}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        className="border-[var(--edit-border)] text-[var(--edit-text)]"
      >
        Browse
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={field.accept}
        multiple={field.multiple}
        className="hidden"
        onChange={handlePick}
      />
    </div>
  );
}

function PasswordField({ field, formik }) {
  const [show, setShow] = useState(false);
  const value = formik.values[field.name];

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={field.name}
        placeholder={field.placeholder}
        value={value ?? ""}
        disabled={field.disabled}
        autoComplete={field.autoComplete ?? "new-password"}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={cn(inputBase, "pr-9")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--edit-muted)] hover:text-[var(--edit-text)]"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function RadioGroupField({ field, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 py-1">
      {(field.options ?? []).map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--edit-text)]"
        >
          <input
            type="radio"
            name={field.name}
            disabled={field.disabled}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 border-[var(--edit-border)] text-[var(--edit-accent)] focus:ring-[var(--edit-accent-soft)]"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function CheckboxGroupField({ field, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  function toggle(optValue) {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 py-1">
      {(field.options ?? []).map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--edit-text)]"
        >
          <ToggleSwitch
            disabled={field.disabled}
            checked={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function MultiSelectField({ field, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
  const selected = Array.isArray(value) ? value : [];
  const options = field.options ?? [];
  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.closest("[data-multiselect-portal]")
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openMenu() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen((o) => !o);
  }

  function toggle(optValue) {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={field.disabled}
        onClick={openMenu}
        className={cn(
          inputBase,
          "flex items-center justify-between gap-2 text-left",
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedLabels.length === 0 && "text-[var(--edit-muted)]",
          )}
        >
          {selectedLabels.length > 0
            ? selectedLabels.join(", ")
            : (field.placeholder ?? "Select options")}
        </span>
        <ChevronDown className="size-4 shrink-0 text-[var(--edit-muted)]" />
      </button>
      {open &&
        createPortal(
          <div
            data-multiselect-portal
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[9999] max-h-48 overflow-y-auto custom-scrollbar rounded-lg border border-[var(--edit-border)] bg-white p-1 shadow-lg"
          >
            {options.length === 0 && (
              <p className="px-2 py-1.5 text-[12px] text-[var(--edit-muted)]">
                No options
              </p>
            )}
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-[var(--edit-soft)]"
              >
                <ToggleSwitch
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

function TagsField({ field, value, onChange }) {
  const [draft, setDraft] = useState("");
  const tags = Array.isArray(value) ? value : [];

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setDraft("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div
      className={cn(inputBase, "flex flex-wrap items-center gap-1.5 py-1.5")}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-md bg-[var(--edit-accent-soft)] px-2 py-0.5 text-[12px] text-[var(--edit-text)]"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-[var(--edit-muted)] hover:text-[var(--edit-text)]"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        disabled={field.disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={
          tags.length === 0 ? (field.placeholder ?? "Type and press Enter") : ""
        }
        className="min-w-[80px] flex-1 border-none bg-transparent p-0 text-[13px] outline-none placeholder:text-[var(--edit-muted)]"
      />
    </div>
  );
}

function renderField(field, formik) {
  const value = formik.values[field.name];

  function setValue(v) {
    formik.setFieldValue(field.name, v);
    formik.setFieldTouched(field.name, true);
  }

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

    case "multiselect":
      return (
        <MultiSelectField field={field} value={value} onChange={setValue} />
      );

    case "checkbox-group":
      return (
        <CheckboxGroupField field={field} value={value} onChange={setValue} />
      );

    case "radio":
      return (
        <RadioGroupField field={field} value={value} onChange={setValue} />
      );

    case "tags":
      return <TagsField field={field} value={value} onChange={setValue} />;

    case "checkbox":
      return (
        <label className="flex cursor-pointer items-center gap-2 py-1">
          <ToggleSwitch
            disabled={field.disabled}
            checked={!!value}
            onChange={(checked) => setValue(checked)}
          />
          {field.checkboxLabel && (
            <span className="text-[13px] text-[var(--edit-text)]">
              {field.checkboxLabel}
            </span>
          )}
        </label>
      );

    case "toggle":
      return (
        <ToggleSwitch
          disabled={field.disabled}
          checked={!!value}
          onChange={(checked) => setValue(checked)}
        />
      );

    case "image":
      return <ImageField field={field} value={value} onChange={setValue} />;

    case "file":
      return <FileField field={field} value={value} onChange={setValue} />;

    case "password":
      return <PasswordField field={field} formik={formik} />;

    case "color":
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            name={field.name}
            value={value || "#000000"}
            disabled={field.disabled}
            onChange={formik.handleChange}
            className="h-9 w-9 cursor-pointer rounded-md border border-[var(--edit-border)] bg-white p-1"
          />
          <input
            type="text"
            value={value ?? ""}
            disabled={field.disabled}
            placeholder="#000000"
            onChange={(e) => formik.setFieldValue(field.name, e.target.value)}
            onBlur={formik.handleBlur}
            className={cn(inputBase, "font-mono")}
          />
        </div>
      );

    case "range":
      return (
        <div className="flex items-center gap-3">
          <input
            type="range"
            name={field.name}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={value ?? field.min ?? 0}
            disabled={field.disabled}
            onChange={(e) =>
              formik.setFieldValue(field.name, e.target.valueAsNumber)
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--edit-border)] accent-[var(--edit-accent)]"
          />
          <span className="w-10 shrink-0 text-right font-mono text-[12px] text-[var(--edit-muted)]">
            {value ?? field.min ?? 0}
          </span>
        </div>
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

    case "email":
    case "tel":
    case "url":
    case "time":
    case "datetime-local":
      return (
        <input
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          value={value ?? ""}
          disabled={field.disabled}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(
            inputBase,
            (field.type === "time" || field.type === "datetime-local") &&
              "font-mono",
          )}
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
