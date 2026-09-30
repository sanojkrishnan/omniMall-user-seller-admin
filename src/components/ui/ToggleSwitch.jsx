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
        "relative inline-flex h-[26px] w-11 shrink-0 bg-gradient-to-b from-gray-500/30 via-white to-gray-500/30 border border-gray-300 items-center rounded-full transition-all duration-300",
        // checked ? "" : "",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] left-[2px] h-5 w-5 rounded-full transition-all duration-300 transform",
          checked ? "translate-x-[17px] bg-[#ab0000]" : "bg-[#5f0000]",
          disabled ? "bg-[#757575]" : "",
        )}
      />
    </button>
  );
}
