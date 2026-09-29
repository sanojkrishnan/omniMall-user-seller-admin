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
        "relative inline-flex h-[26px] w-11 shrink-0 border border-gray-400 items-center rounded-full transition-all duration-300",
        checked ? "bg-gray-300" : "bg-white",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] left-[2px] h-5 w-5 rounded-full transition-all duration-300 transform",
          checked ? "translate-x-[18px]" : "",
          disabled ? "bg-[#757575]" : "bg-[#5f0000]",
        )}
      />
    </button>
  );
}
