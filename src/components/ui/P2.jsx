import { cn } from "../../utils/CN";

function P2({ children, className, as: Tag = "p" }) {
  return (
    <Tag className={cn("text-xs md:text-sm mt-1 text-center", className)}>
      {children}
    </Tag>
  );
}

export default P2;
