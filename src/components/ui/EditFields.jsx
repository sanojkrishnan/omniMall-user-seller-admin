import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "../../utils/CN";
import { inputBase } from "../../utils/inputBase";
import { isTriggerVisible } from "../../utils/getScrollParent";
import SelectionButton from "./SelectionButton";
import MultiSelectField from "./MultiSelectField";
import ToggleSwitch from "./ToggleSwitch";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { useAsyncSelectField } from "../../hooks/useAsyncSelectField";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";

export function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--edit-muted)]">
      {children}
      {required && <span className="text-[var(--edit-danger)]">*</span>}
    </label>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
      <TriangleAlert className="size-3 text-red-500" />
      {message}
    </p>
  );
}

export function AsyncMultiSelectField({ field, formik }) {
  const rawValue = formik.values[field.name];
  const {
    source,
    items,
    labelCache,
    normalizedIds,
    search,
    setSearch,
    loadMore,
    loading,
    hasNextPage,
    open,
    openMenu,
    closeMenu,
  } = useAsyncSelectField(field.asyncEntity, rawValue);

  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
  const selectedLabels = normalizedIds.map((id) => labelCache[id] ?? id);

  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: loading,
    onLoadMore: loadMore,
    triggerId: `async-multiselect-${field.name}-${open ? "open" : "closed"}`,
  });

  function updateCoords() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.closest("[data-async-multiselect-portal]")
      ) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeMenu]);

  useEffect(() => {
    if (!open) return;
    function handleReposition() {
      if (!isTriggerVisible(ref.current)) return closeMenu();
      updateCoords();
    }
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, closeMenu]);

  function toggle(id) {
    const next = normalizedIds.includes(id)
      ? normalizedIds.filter((v) => v !== id)
      : [...normalizedIds, id];
    formik.setFieldValue(field.name, next); // always plain IDs, never objects
    formik.setFieldTouched(field.name, true);
  }

  function handleOpenClick() {
    updateCoords();
    open ? closeMenu() : openMenu();
  }

  if (!source) {
    return (
      <p className="text-[12px] text-red-500">
        Unknown asyncEntity "{field.asyncEntity}"
      </p>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={field.disabled}
        onClick={handleOpenClick}
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
            data-async-multiselect-portal
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[9999] rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <div className="border-b border-gray-200 p-2">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md border border-gray-200 px-2 py-1 text-[13px] text-black outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
              {loading && items.length === 0 && (
                <p className="px-2 py-1.5 text-[12px] text-gray-400">
                  Loading...
                </p>
              )}
              {!loading && items.length === 0 && (
                <p className="px-2 py-1.5 text-[12px] text-gray-400">
                  No results
                </p>
              )}
              {items.map((item) => {
                const id = source.getId(item);
                const isSelected = normalizedIds.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-black hover:bg-gray-50",
                      isSelected && "bg-gray-100",
                    )}
                  >
                    {source.getLabel(item)}
                    {isSelected && (
                      <Check className="size-3.5 shrink-0 text-[var(--edit-accent)]" />
                    )}
                  </button>
                );
              })}
              {/* Observed by useInfiniteScroll — fires onLoadMore when
                  this scrolls into view, instead of manual scroll math. */}
              {hasNextPage && <div id={triggerId} className="h-1" />}
              {loading && items.length > 0 && (
                <p className="px-2 py-1.5 text-[12px] text-gray-400">
                  Loading more...
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export function AsyncSelectField({ field, formik }) {
  const value = formik.values[field.name];
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedIds = value ? [value] : [];
  const { source, items, labelCache, search, setSearch, loadMore, loading } =
    useAsyncSelectField(field.asyncEntity, selectedIds);

  const selectedLabel = value ? (labelCache[value] ?? value) : null;

  function updateCoords() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.closest("[data-async-select-portal]")
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleReposition() {
      if (!isTriggerVisible(ref.current)) {
        setOpen(false);
        return;
      }
      updateCoords();
    }
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  function openMenu() {
    updateCoords();
    setOpen((o) => !o);
  }

  function select(id) {
    formik.setFieldValue(field.name, id);
    formik.setFieldTouched(field.name, true);
    setOpen(false);
  }

  function handleScroll(e) {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) loadMore();
  }

  if (!source) {
    return (
      <p className="text-[12px] text-red-500">
        Unknown asyncEntity "{field.asyncEntity}"
      </p>
    );
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
            !selectedLabel && "text-[var(--edit-muted)]",
          )}
        >
          {selectedLabel ?? field.placeholder ?? "Select an option"}
        </span>
        <ChevronDown className="size-4 shrink-0 text-[var(--edit-muted)]" />
      </button>
      {open &&
        createPortal(
          <div
            data-async-select-portal
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[9999] rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <div className="border-b border-gray-200 p-2">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md border border-gray-200 px-2 py-1 text-[13px] text-black outline-none placeholder:text-gray-400"
              />
            </div>
            <div
              onScroll={handleScroll}
              className="max-h-48 overflow-y-auto custom-scrollbar p-1"
            >
              {items.length === 0 && !loading && (
                <p className="px-2 py-1.5 text-[12px] text-gray-400">
                  No results
                </p>
              )}
              {items.map((item) => {
                const id = source.getId(item);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => select(id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-black hover:bg-gray-50",
                      value === id && "bg-gray-100",
                    )}
                  >
                    {source.getLabel(item)}
                    {value === id && (
                      <Check className="size-3.5 shrink-0 text-[var(--edit-accent)]" />
                    )}
                  </button>
                );
              })}
              {loading && (
                <p className="px-2 py-1.5 text-[12px] text-gray-400">
                  Loading...
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
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

export function FileField({ field, value, onChange }) {
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

export function PasswordField({ field, formik }) {
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

export function renderField(field, formik) {
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

    case "select": {
      const options = field.options ?? [];
      const selectedOption = options.find((o) => o.value === value);
      return (
        <SelectionButton
          // Force a remount whenever the underlying value changes from
          // outside (e.g. modal reopened for a different record).
          // SelectionButton only reads defaultValue once on mount, so
          // without this key it would keep showing a stale selection.
          key={`${field.name}:${value ?? "empty"}`}
          addSearch={field.searchable}
          placeholder={field.placeholder}
          disabled={field.disabled}
          defaultValue={selectedOption?.label ?? null}
          // Portals to document.body as position:fixed — must sit above
          // the modal's own z-50 overlay or it renders invisibly behind it.
          zIndex={9999}
          onChange={(label) => {
            const opt = options.find((o) => o.label === label);
            setValue(opt ? opt.value : label);
          }}
        >
          {options.map((o) => o.label)}
        </SelectionButton>
      );
    }

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

    case "async-multiselect":
      return <AsyncMultiSelectField field={field} formik={formik} />;

    case "async-select":
      return <AsyncSelectField field={field} formik={formik} />;

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
