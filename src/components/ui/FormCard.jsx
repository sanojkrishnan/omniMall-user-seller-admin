import { forwardRef } from "react";
import { cn } from "../../utils/CN";

export const FormCard = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-y-scroll custom-scrollbar max-w-[500px] min-w-[310px] max-h-[570px] shadow-lg bg-gradient-to-br from-white/0 via-white/40 to-white/0 backdrop-blur-md rounded-xl p-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

FormCard.displayName = "FormCard";
