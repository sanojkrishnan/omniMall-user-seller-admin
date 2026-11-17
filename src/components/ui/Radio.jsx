import { Check } from "lucide-react";

// div (not button) so inputs inside are valid HTML
export default function Radio({ selected, onClick, children }) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (
          e.target === e.currentTarget &&
          (e.key === "Enter" || e.key === " ")
        ) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-black bg-black/[0.03]"
          : "border-black/15 hover:border-black/60"
      }`}
    >
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
          selected ? "border-black bg-black text-white" : "border-black/40"
        }`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
