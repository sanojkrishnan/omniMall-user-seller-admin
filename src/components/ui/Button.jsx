import { cn } from "../../utils/CN";

const variants = {
  primary:
    "bg-black text-white w-full hover:shadow-lg shadow-black p-2 mt-4 rounded-lg",
  secondary:
    "border-[0.5px] border-black/40 shadow-lg hover:bg-white/20 w-full p-2 mt-2 rounded-lg",
};

export const Button = ({
  children,
  className,
  disabled,
  variant = "primary",
  ...props
}) => {
  return (
    <button
      className={cn(
        // base styles (shared by all variants)
        "px-4 py-2 font-medium transition-colors w-full mt-4 rounded-lg",
        // pick the variant
        variants[variant],
        // disabled state
        disabled && "opacity-80 cursor-not-allowed",
        // parent override
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
