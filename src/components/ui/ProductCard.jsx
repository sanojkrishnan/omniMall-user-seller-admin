import { useRef, useState } from "react";
import { HeartIcon, ShoppingCart, Check, TriangleAlert } from "lucide-react";
import { Button } from "./Button";
import { Rating } from "./Rating";
import { useNavigate } from "react-router-dom";
import P from "./P";
import H2 from "./H2";
import { useHandleCartClick } from "../../hooks/useHandleCartClick";
import { toast } from "react-toastify";
import Loading from "../ui/Loading";

function ProductCard({ products }) {
  const navigate = useNavigate();
  const handleCartClick = useHandleCartClick();
  const [status, setStatus] = useState({});
  const timeoutsRef = useRef({});

  const setItemStatus = (id, value) => {
    setStatus((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = async (e, item) => {
    e.stopPropagation();

    if (status[item._id] === "loading") return;

    if (timeoutsRef.current[item._id]) {
      clearTimeout(timeoutsRef.current[item._id]);
      delete timeoutsRef.current[item._id];
    }

    setItemStatus(item._id, "loading");

    const result = await handleCartClick(item);
    const succeeded = result?.meta?.requestStatus === "fulfilled";

    if (succeeded) {
      toast.success("Product added to cart");
      setItemStatus(item._id, "added");
      timeoutsRef.current[item._id] = setTimeout(() => {
        setItemStatus(item._id, "idle");
        delete timeoutsRef.current[item._id];
      }, 1200);
    } else {
      toast.error(result?.payload || "Failed to add to cart");
      setItemStatus(item._id, "error");
      timeoutsRef.current[item._id] = setTimeout(() => {
        setItemStatus(item._id, "idle");
        delete timeoutsRef.current[item._id];
      }, 1800);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
      {products.map((item) => {
        const itemStatus = status[item._id] || "idle";
        const isAdded = itemStatus === "added";
        const isLoading = itemStatus === "loading";
        const isError = itemStatus === "error";

        return (
          <div
            onClick={() => navigate(`/user/shop/product/${item._id}`)}
            key={item._id}
            className="bg-white border border-gray-100 overflow-hidden flex flex-col shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-500"
          >
            {/* Image */}
            <div className="relative w-full aspect-[16/9] bg-gray-50 overflow-hidden">
              {item.productImage?.length > 0 ? (
                <img
                  className="w-full h-full object-cover"
                  src={item.productImage[0]?.url}
                  alt={item.productName}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                  <TriangleAlert className="size-10" />
                  <P className="text-sm">No image available</P>
                </div>
              )}

              {item.offerPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-red-50 text-red-400 text-xs font-medium px-2 py-1 rounded-md">
                  {item.offerPercentage}% off
                </span>
              )}

              <button
                className="absolute top-2.5 right-2.5 bg-white border border-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                aria-label="Add to wishlist"
                onClick={(e) => e.stopPropagation()}
              >
                <HeartIcon className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-2 text-center p-4 flex-1">
              <H2 className="lg:text-[15px] md:text-[15px] text-[15px] font-medium text-gray-800 leading-snug">
                {item.productName}
              </H2>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {item.productDesc}
              </p>

              <Rating rating={item.rating} />

              <hr className="border-t border-gray-100 my-1" />

              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-medium text-gray-800">
                    ₹{item.offerPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-300 line-through">
                    ₹{item.mrp.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-green-500 text-start">
                  You save ₹{(item.mrp - item.offerPrice).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 pt-1 mt-auto pb-2">
                <Button
                  className="flex-1 text-sm py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  Buy now
                </Button>

                <Button
                  variant="secondary"
                  className={`flex-1 text-sm transition-all duration-300 ease-out ${
                    isAdded
                      ? "bg-green-500 border-green-500 text-white scale-[1.03]"
                      : isError
                        ? "bg-yellow-500 border-yellow-500 text-white scale-[1.03]"
                        : ""
                  }`}
                  onClick={(e) => handleAddToCart(e, item)}
                  disabled={isAdded || isLoading}
                >
                  <span
                    key={itemStatus}
                    className="flex items-center gap-1.5"
                    style={{
                      animation: "pop-in 0.35s ease",
                    }}
                  >
                    {isAdded ? (
                      <Check className="size-4" />
                    ) : isLoading ? (
                      <Loading className="size-4" />
                    ) : isError ? (
                      <TriangleAlert className="size-4" />
                    ) : (
                      <ShoppingCart className="size-4" />
                    )}
                    {isAdded
                      ? "Added!"
                      : isLoading
                        ? "Adding..."
                        : isError
                          ? "Try again"
                          : "Add to cart"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductCard;
