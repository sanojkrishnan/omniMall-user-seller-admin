import { useState, useEffect } from "react";
import ProductCard from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../../components/ui/SearchBar";
import { Filter } from "lucide-react";
import Footer from "../../components/Footer";

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
    rating: 2,
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
    rating: 1,
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
    rating: 4,
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
    rating: 3,
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
  const navigate = useNavigate();

  // Auto change every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {/* Carousel */}
      <div className="relative w-full lg:h-[90vh] h-[40vh] md:h-[60vh] overflow-hidden">
        <div className="absolute z-10  flex justify-between items-center w-full">
          {/* header */}
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
                <div className="absolute w-full h-full hover:shadow-[inset_0_-70px_70px_rgba(0,0,0,100)] transition-all duration-500 rounded-lg shadow-[inset_0_-50px_50px_rgba(0,0,0,100)] flex items-end justify-center">
                  <p className="text-center w-fit mb-2 px-4">{item.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* featured products  */}
      <div className="w-full text-center sm:p-8 p-4 py-12 sm:py-16">
        <div className="pb-10">
          <h1 className="text-3xl font-semibold mb-2">Featured Products</h1>
          <p>Handpicked favorites just for you</p>
        </div>
        <div className="flex items-center mb-10 border-b-[0.5px] pb-10">
          <SearchBar className={"border-black"} />
          <Button className={"w-fit px-6 m-0 ml-4"}>
            <Filter className="size-4 " /> Filter
          </Button>
        </div>
        <ProductCard products={featuredProducts} />
        <div className="flex justify-center items-center mt-10">
          <Button
            variant="secondary"
            className={"w-fit"}
            onClick={() => {
              navigate("/shop");
            }}
          >
            view more
          </Button>
        </div>
      </div>

      {/* coupons  */}

      <div className="w-full text-center bg-gray-200 sm:p-10 p-4 py-16">
        <div className="pb-10">
          <h1 className="text-3xl font-semibold mb-2">
            Special Offers And Coupons
          </h1>
          <p>Save more with our exclusive deals</p>
        </div>
      </div>

      {/* footer */}
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
