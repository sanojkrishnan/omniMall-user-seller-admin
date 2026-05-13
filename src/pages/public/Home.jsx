import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { FormCard } from "../../components/ui/FormCard";
import { Star } from "lucide-react";
import { Button } from "../../components/ui/Button";

const carouselImages = [
  { image: "/src/assets/carausal/clothes.jfif", alt: "Clothes" },
  { image: "/src/assets/carausal/electronics.jfif", alt: "Electronics" },
  { image: "/src/assets/carausal/home Pikbest.jfif", alt: "Home" },
];

const featuredProducts = [
  {
    productName: "Lenovo laptop",
    productDesc:
      "32gb/1tb intel 13th gen i5 | 16inch 100% srgb ips display | gray | dedicated intel graphics",
    rating: 5,
    productImages: [
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
    ],
    mrp: 150000,
    offerPercentage: 20,
    offerPrice: 120000,
    quantity: 14,
  },
  {
    productName: "Lenovo laptop",
    productDesc:
      "32gb/1tb intel 13th gen i5 | 16inch 100% srgb ips display | gray | dedicated intel graphics",
    rating: 5,
    productImages: [
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
    ],
    mrp: 150000,
    offerPercentage: 20,
    offerPrice: 120000,
    quantity: 14,
  },
  {
    productName: "Lenovo laptop",
    productDesc:
      "32gb/1tb intel 13th gen i5 | 16inch 100% srgb ips display | gray | dedicated intel graphics",
    rating: 5,
    productImages: [
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
    ],
    mrp: 150000,
    offerPercentage: 20,
    offerPrice: 120000,
    quantity: 14,
  },
  {
    productName: "Lenovo laptop",
    productDesc:
      "32gb/1tb intel 13th gen i5 | 16inch 100% srgb ips display | gray | dedicated intel graphics",
    rating: 5,
    productImages: [
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
    ],
    mrp: 150000,
    offerPercentage: 20,
    offerPrice: 120000,
    quantity: 14,
  },
  {
    productName: "Lenovo laptop",
    productDesc:
      "32gb/1tb intel 13th gen i5 | 16inch 100% srgb ips display | gray | dedicated intel graphics",
    rating: 5,
    productImages: [
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
    ],
    mrp: 150000,
    offerPercentage: 20,
    offerPrice: 120000,
    quantity: 14,
  },
  {
    productName: "Lenovo laptop",
    productDesc:
      "32gb/1tb intel 13th gen i5 | 16inch 100% srgb ips display | gray | dedicated intel graphics",
    rating: 5,
    productImages: [
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
      { image: "/src/assets/homeSort/product-laptop.jpg" },
    ],
    mrp: 150000,
    offerPercentage: 20,
    offerPrice: 120000,
    quantity: 14,
  },
];

const categoryList = [
  {
    category: "Electronics",
    image: "/src/assets/homeSort/electronics.jpeg",
    alt: "electronics",
  },
  {
    category: "Home Appliances",
    image: "/src/assets/homeSort/Kitchen Appliances Setup.jpeg",
    alt: "home appliances",
  },
  {
    category: "Beauty",
    image: "/src/assets/homeSort/beauty.jpeg",
    alt: "beauty",
  },
  {
    category: "Fashion",
    image: "/src/assets/homeSort/fashion.jpeg",
    alt: "fashion",
  },
  {
    category: "Accessories",
    image: "/src/assets/homeSort/accessories.jpeg",
    alt: "accessories",
  },
  {
    category: "Beverages",
    image: "/src/assets/homeSort/beverages.jpeg",
    alt: "beverages",
  },
];

function Home() {
  const [current, setCurrent] = useState(0);

  // Auto change every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Carousel */}
      <div className="relative w-full lg:h-[90vh] h-[40vh] md:h-[60vh] overflow-hidden">
        <div className="absolute z-10  flex justify-between items-center w-full">
          {/* header */}
          <Header />
        </div>
        {carouselImages.map((item, index) => (
          <img
            key={index}
            src={item.image}
            alt={item.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* shop by category */}
      <div
        className="w-full h-fit bg-gradient-to-br text-white text-center sm:p-8 p-2 py-12 sm:py-24"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #2a2a3a 0%, #111118 50%, #0a0a0f 100%)",
        }}
      >
        <div className="pb-10">
          <h1 className="text-3xl font-semibold">Shop By Category</h1>
          <p>Explore our wide range of products</p>
        </div>
        <div className="flex px-20 overflow-x-auto justify-evenly loopScroll mt-10 ">
          {categoryList.map((item, index) => {
            return (
              <div
                className="relative min-w-28 h-40 mr-10 cursor-pointer overflow-hidden"
                key={index}
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  src={item.image}
                  alt={item.alt}
                />
                <div className="absolute z-50 w-full h-full hover:scale-110 hover:shadow-[inset_0_-70px_70px_rgba(0,0,0,100)] transition-all duration-500 rounded-lg shadow-[inset_0_-50px_50px_rgba(0,0,0,100)] flex items-end justify-center">
                  <p className="text-center w-fit mb-2 px-4">{item.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* featured products  */}
      <div className="w-full text-center sm:p-8 p-4 py-12 sm:py-24">
        <div className="pb-10">
          <h1 className="text-3xl font-semibold mb-2">Featured Products</h1>
          <p>Handpicked favorites just for you</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-4 grid-cols-1 sm:grid-cols-2">
          {featuredProducts.map((item, index) => {
            return (
              <div
                key={index}
                class="bg-neutral-primary-soft justify-self-center p-2 sm:p-4 block w-sm sm:w-full border border-default mt-4 rounded-lg shadow-lg"
              >
                <div className="relative w-full h-fit">
                  <img
                    class="rounded-t-base object-cover h-64 w-full"
                    src={item.productImages[0].image}
                    alt=""
                  />
                  <div className="absolute flex items-end justify-center w-full h-1/2 bottom-0 rounded-b-lg bg-gradient-to-t from-gray-900 to-white/0">
                    {item.productImages.map(() => (
                      <div
                        className={`w-2 h-2 rounded-full bg-white border border-black mx-1 my-5`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div class="p-6">
                  <h1 class="mt-3 mb-6 text-2xl font-semibold tracking-tight text-heading">
                    {item.productName}
                  </h1>
                  <p>{item.productDesc}</p>
                  <div className="flex mt-5 w-full items-center justify-center">
                    <p>
                      <Star />
                    </p>
                    <p>
                      <Star />
                    </p>
                    <p>
                      <Star />
                    </p>
                    <p>
                      <Star />
                    </p>
                    <p>
                      <Star />
                    </p>
                  </div>
                  <div>
                    <h5 className="">
                      Price :{" "}
                      <span className="text-red-500 line-through">
                        {item.mrp}$
                      </span>
                    </h5>
                    <p className="text-yellow-600">
                      {item.offerPercentage}% discount
                    </p>
                    <h5 className="text-green-500 text-3xl">
                      {item.offerPrice}$
                    </h5>
                    <div className="pt-4">
                      <Button>Buy Now</Button>
                      <Button variant="secondary">Add To Cart</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
