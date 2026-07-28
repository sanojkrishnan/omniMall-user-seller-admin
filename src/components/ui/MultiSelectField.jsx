import { Check, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/CN";
import { useEffect, useRef, useState } from "react";
import { inputBase } from "../../utils/inputBase";
import { isTriggerVisible } from "../../utils/getScrollParent";

export default function MultiSelectField({ field, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
  const selected = Array.isArray(value) ? value : [];
  const options = field.options ?? [];
  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  function updateCoords() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }

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

  useEffect(() => {
    if (!open) return;
    // capture: true catches scroll on the modal's inner overflow-y-auto
    // grid, not just window scroll
    function handleReposition() {
      // If the trigger has scrolled outside the modal's visible field
      // area, close the menu instead of letting it float past the edge —
      // it's portaled to document.body so nothing clips it automatically.
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
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[9999] max-h-48 overflow-y-auto custom-scrollbar rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            {options.length === 0 && (
              <p className="px-2 py-1.5 text-[12px] text-gray-400">
                No options
              </p>
            )}
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-black hover:bg-gray-50",
                    isSelected && "bg-gray-100",
                  )}
                >
                  {opt.label}
                  {isSelected && (
                    <Check className="size-3.5 shrink-0 text-[var(--edit-accent)]" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}