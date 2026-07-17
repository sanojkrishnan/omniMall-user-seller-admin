import { forwardRef } from "react";
import { cn } from "../../utils/CN";

const variants = {
  primary:
    "bg-black text-white w-full hover:shadow-lg shadow-black rounded-lg text-center flex items-center justify-center gap-2",
  secondary:
    "border-[0.5px] border-black/40 shadow-lg w-full rounded-lg text-center flex items-center justify-center gap-2",
};

export const Button = forwardRef(
  ({ children, className, disabled, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "py-2 px-4 text-xs  md:text-base font-medium hover:scale-[102%] transition-all duration-200 w-full mt-4 sm:mt-2 rounded-lg",
          variants[variant],
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
