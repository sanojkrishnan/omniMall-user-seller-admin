import React from "react";
import { Button } from "./Button";
import { Rating } from "./Rating";
import { HeartIcon, ShoppingCart } from "lucide-react";

function ProductCard({ products }) {
  return (
    <div className="grid lg:grid-cols-3 gap-4 grid-cols-1 sm:grid-cols-2">
      {products.map((item, index) => {
        return (
          <div
            key={index}
            class="bg-neutral-primary-soft hover:scale-105 duration-500 justify-self-center p-2 sm:p-4 block w-sm sm:w-full border border-default mt-4 rounded-lg shadow-lg"
          >
            <div className="relative w-full h-fit">
              <img
                class="rounded-t-base object-cover h-64 w-full"
                src={item.productImages[0].image}
                alt=""
              />
              <div className="absolute flex items-end justify-end w-full h-1/2 bottom-0 rounded-b-lg bg-gradient-to-t from-gray-900 to-white/0">
                <button
                  className="m-4 mb-2 text-red-500 cursor-pointer"
                  onClick={() => {}}
                >
                  <HeartIcon className="fill-red-500" />
                </button>
              </div>
            </div>
            <div class="p-6">
              <h1 class="mt-3 mb-6 text-2xl font-semibold tracking-tight text-heading">
                {item.productName}
              </h1>
              <p>{item.productDesc}</p>
              <Rating rating={item.rating} />
              <div>
                <h5 className="">
                  Price :
                  <span className="text-red-500 line-through">{item.mrp}$</span>
                </h5>
                <p className="text-yellow-600">
                  {item.offerPercentage}% discount
                </p>
                <h5 className="text-green-500 text-3xl">{item.offerPrice}$</h5>
                <div className="pt-4">
                  <Button>Buy Now</Button>
                  <Button variant="secondary"><ShoppingCart /> Add To Cart</Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductCard;
