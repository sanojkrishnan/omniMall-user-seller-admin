// components/ui/ImageFields.jsx
//
// Two field renderers to plug into EditFields.jsx's `renderField` switch:
//   case "image":       return <ImageField field={field} formik={formik} />;
//   case "image-array": return <ImageArrayField field={field} formik={formik} />;
//
// Both read/write straight into Formik via field.name, and both use the
// --edit-accent / --edit-border / --edit-soft / --edit-muted CSS variables
// that CreatePanel.jsx already sets on its wrapper — so they theme correctly
// for "admin" (#5f0000) and "user" (black) variants without any extra props.
//
// Values stored in Formik:
//   image        -> File (newly picked) | string (existing URL, edit mode) | null
//   image-array  -> Array<File | string>

import { useRef } from "react";
import { ImageIcon, Plus, X } from "lucide-react";

function toPreviewSrc(value) {
  if (!value) return null;
  return typeof value === "string" ? value : URL.createObjectURL(value);
}

export function ImageField({ field, formik }) {
  const inputRef = useRef(null);
  const value = formik.values[field.name];
  const preview = toPreviewSrc(value);

  const handlePick = (e) => {
    const file = e.target.files?.[0];
    if (file) formik.setFieldValue(field.name, file);
    e.target.value = ""; // allow re-picking the same file
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={field.accept ?? "image/*"}
        className="hidden"
        onChange={handlePick}
      />

      {preview ? (
        <div className="relative w-24 h-24">
          <img
            src={preview}
            alt=""
            className="w-24 h-24 rounded-lg object-cover border"
            style={{ borderColor: "var(--edit-border)" }}
          />
          <button
            type="button"
            onClick={() => formik.setFieldValue(field.name, null)}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border shadow-sm"
            style={{ borderColor: "var(--edit-border)", color: "var(--edit-danger)" }}
          >
            <X size={12} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 rounded-lg bg-black/0 hover:bg-black/30 text-white text-[11px] font-medium opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-[11px] font-medium"
          style={{
            borderColor: "var(--edit-accent)",
            background: "var(--edit-accent-soft)",
            color: "var(--edit-accent)",
          }}
        >
          <ImageIcon size={18} />
          Upload
        </button>
      )}
    </div>
  );
}

export function ImageArrayField({ field, formik }) {
  const inputRef = useRef(null);
  const values = formik.values[field.name] || [];
  const max = field.maxItems;

  const handlePick = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const next = max ? [...values, ...picked].slice(0, max) : [...values, ...picked];
    formik.setFieldValue(field.name, next);
    e.target.value = "";
  };

  const removeAt = (idx) => {
    formik.setFieldValue(
      field.name,
      values.filter((_, i) => i !== idx),
    );
  };

  const atLimit = max ? values.length >= max : false;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={field.accept ?? "image/*"}
        multiple
        className="hidden"
        onChange={handlePick}
      />

      <div className="flex flex-wrap gap-2">
        {values.map((val, idx) => {
          const preview = toPreviewSrc(val);
          return (
            <div key={idx} className="relative w-20 h-20">
              <img
                src={preview}
                alt=""
                className="w-20 h-20 rounded-lg object-cover border"
                style={{ borderColor: "var(--edit-border)" }}
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white border shadow-sm"
                style={{ borderColor: "var(--edit-border)", color: "var(--edit-danger)" }}
              >
                <X size={11} />
              </button>
            </div>
          );
        })}

        {!atLimit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-[10px] font-medium"
            style={{
              borderColor: "var(--edit-accent)",
              background: "var(--edit-accent-soft)",
              color: "var(--edit-accent)",
            }}
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>

      {max && (
        <p className="mt-1.5 text-[11px]" style={{ color: "var(--edit-muted)" }}>
          {values.length}/{max} images
        </p>
      )}
    </div>
  );
}