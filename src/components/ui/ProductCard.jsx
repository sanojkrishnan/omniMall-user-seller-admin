import { HeartIcon, ShoppingCart, TriangleAlert } from "lucide-react";
import { Button } from "./Button";
import { Rating } from "./Rating";
import { useNavigate } from "react-router-dom";

function ProductCard({ products }) {
  const navigate = useNavigate();
  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
      {products.map((item, index) => (
        <div
          onClick={() => navigate(`/user/shop/product/${item._id}`)}
          key={index}
          className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-500"
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
                <p className="text-sm">No image available</p>
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
              onClick={() => {}}
            >
              <HeartIcon className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-2 text-center p-4 flex-1">
            <h2 className="text-[15px] font-medium text-gray-800 leading-snug">
              {item.productName}
            </h2>
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
              <Button className="flex-1 text-sm py-2">Buy now</Button>
              <Button variant="secondary" className="flex-1 text-sm ">
                <ShoppingCart className="size-4" /> Add to cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCard;
