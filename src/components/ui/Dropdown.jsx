import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/CN";
import { isTriggerVisible } from "../../utils/getScrollParent";

export function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

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
        !e.target.closest("[data-dropdown-portal]")
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    // capture: true so this fires for scroll on ANY ancestor,
    // not just window — e.g. the modal's inner overflow-y-auto field grid
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

  function handleSelect(optValue) {
    onChange?.(optValue);
    setOpen(false);
  }

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={openMenu}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none transition-colors",
          "border-[var(--edit-border)] text-[var(--edit-text)]",
          "focus:border-[var(--edit-accent)] focus:ring-2 focus:ring-[var(--edit-accent-soft)]",
          "flex items-center justify-between gap-2 text-left",
        )}
      >
        <span
          className={cn(
            "truncate",
            !selectedOption && "text-[var(--edit-muted)]",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="size-4 shrink-0 text-[var(--edit-muted)]" />
      </button>
      {open &&
        createPortal(
          <div
            data-dropdown-portal
            style={{
              position: "fixed",
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
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-[var(--edit-soft)]",
                  value === opt.value && "bg-[var(--edit-accent-soft)]",
                )}
              >
                {opt.label}
                {value === opt.value && (
                  <Check className="size-3.5 shrink-0 text-[var(--edit-accent)]" />
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
