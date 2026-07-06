import { useState, useEffect } from "react";
import ProductCard from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import SortCategory from "../../components/ui/SortCategory";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../redux/slice/productSlice";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";

const carouselImages = [
  { image: "/src/assets/carausal/clothes.jfif", alt: "Clothes" },
  { image: "/src/assets/carausal/electronics.jfif", alt: "Electronics" },
  { image: "/src/assets/carausal/home Pikbest.jfif", alt: "Home" },
];

function Home() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //product fetch
  const {
    products = [],
    isProductLoading,
    productError,
  } = useSelector((state) => state.product);

  // Fetch
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        page: 1,
        limit: 15,
        isFeatured: true,
      }),
    );
  }, [dispatch]);

  // Auto change every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="">
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
        <div className="max-w-7xl mx-auto">
          <div className=" pb-10">
            <h1 className="text-3xl font-semibold">Shop By Category</h1>
            <p>Explore our wide range of products</p>
          </div>
          <SortCategory />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* featured products  */}
        <div className="w-full text-center sm:p-8 p-4 py-12 sm:py-16">
          <div className="pb-10">
            <h1 className="text-3xl font-semibold mb-2">Featured Products</h1>
            <p>Handpicked favorites just for you</p>
          </div>
          {isProductLoading && !productError && (
            <div className="w-full h-[60vh] flex justify-center items-center">
              <CartLoading />
            </div>
          )}
          {products.length !== 0 && !isProductLoading && !productError && (
            <>
              <ProductCard products={products} />
              <div className="flex justify-center items-center mt-10">
                <Button
                  variant="secondary"
                  className={"w-fit"}
                  onClick={() => {
                    navigate("/user/shop");
                  }}
                >
                  view more
                </Button>
              </div>
            </>
          )}
          <ErrorFallback loading={isProductLoading} error={productError} />
        </div>
      </div>
      {/* coupons  */}
      <div className="w-full text-center bg-gray-200 sm:p-10 p-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="pb-10">
            <h1 className="text-3xl font-semibold mb-2">
              Special Offers And Coupons
            </h1>
            <p>Save more with our exclusive deals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
