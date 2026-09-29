import { forwardRef } from "react";
import { cn } from "../../utils/CN";

export const FormCard = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-y-scroll border-[1px] border-black/5  custom-scrollbar max-w-[500px] min-w-[310px] max-h-[570px] shadow-lg bg-gradient-to-br from-gray-500/30 via-white/60 to-gray-500/30 rounded-2xl p-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

FormCard.displayName = "FormCard";
