import { cn } from "../../utils/CN";

function H3({ children, className, as: Tag = "h3" }) {
  return (
    <Tag
      className={cn(
        "text-sm md:text-base lg:text-lg font-semibold mt-4 text-center",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default H3;
