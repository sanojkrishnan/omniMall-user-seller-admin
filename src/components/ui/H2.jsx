import { cn } from "../../utils/CN";

function H2({ children, className, as: Tag = "h2" }) {
  return (
    <Tag
      className={cn(
        "text-md md:text-xl lg:text-2xl font-semibold mt-6 text-center",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default H2;
