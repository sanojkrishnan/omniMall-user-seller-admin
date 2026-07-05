import { cn } from "../../utils/CN";

function H4({ children, className, as: Tag = "h4" }) {
  return (
    <Tag
      className={cn(
        "text-sm md:text-base lg:text-lg font-semibold mt-1 text-center",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default H4;
