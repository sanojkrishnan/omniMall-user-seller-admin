import { cn } from "../../utils/CN";

const variants = {
  primary: "backdrop-blur-lg border rounded-2xl border-[#5f0000]",
};

export const SearchBar = ({ className, disabled, variant = "primary" }) => {
  return (
    <input
      disabled={disabled}
      placeholder="Search here..."
      type="text"
      className={cn(
        // base styles (shared by all variants)
        "p-4 w-full",
        // pick the variant
        variants[variant],
        // disabled state
        disabled && "opacity-70 cursor-not-allowed",
        // parent override
        className,
      )}
    />
  );
};
