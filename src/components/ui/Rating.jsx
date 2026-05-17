import { Star } from "lucide-react";
import { cn } from "../../utils/CN";

export const Rating = ({ className, rating }) => {
  return (
    <div
      className={cn("flex mt-5 w-full items-center justify-center", className)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={
            star <= rating ? "fill-yellow-500 text-yellow-500" : "text-black"
          }
        />
      ))}
    </div>
  );
};
