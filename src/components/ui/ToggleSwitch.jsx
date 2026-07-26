import { cn } from "../../utils/CN";

export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
}) {
  function handleClick() {
    if (disabled) return;
    onChange?.(!checked);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300",
        checked ? "bg-[#f3e9e8]" : "bg-gray-200",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] left-[2px] h-5 w-5 rounded-full transition-all duration-300 transform",
          checked ? "translate-x-full bg-[#5f0000]" : "bg-[#b17b7b]",
        )}
      />
    </button>
  );
}
