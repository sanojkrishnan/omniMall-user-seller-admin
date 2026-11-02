import { cn } from "../../utils/CN";

const VARIANTS = {
  admin: {
    track:
      "bg-gradient-to-b from-gray-500/30 via-white/60 to-gray-500/30 border-gray-300",
    thumbOn: "translate-x-[17px] bg-[#ab0000]",
    thumbOff: "bg-[#5f0000]",
    thumbDisabled: "bg-[#757575]",
    focus: "focus-visible:ring-[#ab0000]",
  },
  user: {
    track: "bg-white border-black",
    thumbOn: "translate-x-[17px] bg-black",
    thumbOff: "bg-black/70",
    thumbDisabled: "bg-neutral-300",
    focus: "focus-visible:ring-black",
  },
};

export default function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  variant = "admin",
}) {
  const theme = VARIANTS[variant] ?? VARIANTS.admin;

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
        "relative inline-flex h-[26px] w-11 shrink-0 items-center rounded-full border transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        theme.track,
        theme.focus,
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "absolute left-[2px] top-[2px] h-5 w-5 transform rounded-full transition-all duration-300",
          checked ? theme.thumbOn : theme.thumbOff,
          disabled && theme.thumbDisabled,
        )}
      />
    </button>
  );
}
