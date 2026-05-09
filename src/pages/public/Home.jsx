import { useState, useEffect } from "react";
import OmniMall from "../../components/ui/OmniMall";
import {
  HomeIcon,
  SettingsIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react";

const carouselImages = [
  { image: "/src/assets/carausal/clothes.jfif", alt: "Clothes" },
  { image: "/src/assets/carausal/electronics.jfif", alt: "Electronics" },
  { image: "/src/assets/carausal/home Pikbest.jfif", alt: "Home" },
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
      <div className="relative w-full h-[90vh]  overflow-hidden">
        <div className="absolute z-10  flex justify-between items-center w-full">
          <div className="m-2 ml-4 w-fit ">
            <OmniMall />
          </div>

          {/* menu */}
          <div className="mr-5 hidden sm:block">
            <div className="w-fit px-2 py-2 text-center text-white rounded-b-3xl bg-black flex justify-evenly">
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <HomeIcon />
                <p>Home</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <ShoppingBagIcon />
                <p>Home</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <ShoppingCartIcon />
                <p>Home</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <SettingsIcon />
                <p>Home</p>
              </div>
            </div>
          </div>

          {/* mobile menu */}
          <div className=" fixed top-3 right-0 flex sm:hidden">
            <div className="w-fit px-2 py-2 text-center text-white rounded-l-3xl bg-black flex flex-col justify-evenly">
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <HomeIcon />
                <p>Home</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <ShoppingBagIcon />
                <p>Home</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <ShoppingCartIcon />
                <p>Home</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center w-16 h-16 hover:bg-white hover:text-black rounded-3xl cursor-pointer">
                <SettingsIcon />
                <p>Home</p>
              </div>
            </div>
          </div>
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
      <div className="w-full "></div>
    </div>
  );
}

export default Home;
