import { useState, useEffect } from "react";
import Header from "../../components/Header";

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
      <div
        className="w-full h-80 bg-gradient-to-br text-white text-center p-8"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #2a2a3a 0%, #111118 50%, #0a0a0f 100%)",
        }}
      >
        <h1 className="text-3xl font-semibold mb-2">Shop By Category</h1>
        <p>Explore our wide range of products</p>

        <div>
          {/* category over here  */}
        </div>
      </div>
    </div>
  );
}

export default Home;
