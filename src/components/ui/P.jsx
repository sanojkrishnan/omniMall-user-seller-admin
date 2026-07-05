import { cn } from "../../utils/CN";

function P({ children, className, as: Tag = "p" }) {
  return (
    <Tag
      className={cn(
        "text-xs md:text-sm lg:text-md font-semibold mt-1 text-center",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default P;
