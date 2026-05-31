import { cn } from "../../utils/CN";

const variants = {
  primary:
    "bg-black text-white w-full hover:shadow-lg shadow-black p-2 mt-4 rounded-lg text-center flex items-center justify-center gap-2",
  secondary:
    "border-[0.5px] border-black/40 shadow-lg hover:bg-white/20 w-full p-2 mt-2 rounded-lg text-center flex items-center justify-center gap-2",
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
        "px-4 py-2 font-medium hover:scale-105 duration-500 transition-colors w-full mt-4 rounded-lg",
        // pick the variant
        variants[variant],
        // disabled state
        disabled && "opacity-70 cursor-not-allowed hover:scale-100",
        // parent override
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
