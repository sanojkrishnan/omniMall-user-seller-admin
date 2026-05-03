import { cn } from "../../utils/CN";

const variants = {
  primary: "w-16 h-16 border-4 border-t-black rounded-full animate-spin",
  secondary:
    "w-6 h-6 border-2 border-white border-t-black rounded-full animate-spin",
};

function Loading({ className, variant = "primary", ...props }) {
  return (
    <>
      <div className="flex items-center justify-center h-[100%] w-full bg-transparent">
        {/* Outer Spinner Ring */}
        <div className="relative flex items-center justify-center">
          <div className={cn(variants[variant], className)} {...props}></div>
        </div>
      </div>
    </>
  );
}

export default Loading;
