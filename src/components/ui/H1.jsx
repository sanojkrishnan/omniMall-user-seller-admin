import { cn } from "../../utils/CN";

function H1({ children, className, as: Tag = "h1" }) {
  return (
    <Tag
      className={cn(
        "text-lg md:text-2xl lg:text-3xl font-semibold mt-8 text-center",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default H1;
