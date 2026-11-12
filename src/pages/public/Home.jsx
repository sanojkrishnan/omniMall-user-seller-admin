
import { useState, useEffect, useRef } from "react";
import ProductCard from "../../components/ui/ProductCard";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import SortCategory from "../../components/ui/SortCategory";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../redux/slice/productSlice";
import CartLoading from "../../components/ui/CartLoading";
import ErrorFallback from "../../components/ui/ErrorFallback";
import { CouponList } from "../../components/CouponList";
import { fetchCoupon } from "../../redux/slice/couponSlice";
import CarouselSlide from "../../components/ui/CarouselSlide";

// Import carousel images.
import clothes from "../../assets/carausal/clothes.jfif";
import electronics from "../../assets/carausal/electronics.jfif";
import home from "../../assets/carausal/home Pikbest.jfif";

const carouselImages = [
  { image: clothes, alt: "Clothes" },
  { image: electronics, alt: "Electronics" },
  { image: home, alt: "Home" },
];

function Home() {
  const [current, setCurrent] = useState(0);
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const currentRef = useRef(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const slideCount = carouselImages.length;

  // Keep current slide accessible to visibility handlers.
  currentRef.current = current;

  // Clone the last and first slides for infinite looping.
  const slides = [
    carouselImages[slideCount - 1],
    ...carouselImages,
    carouselImages[0],
  ];

  // Product state.
  const {
    products = [],
    isProductLoading,
    productError,
    productErrorStatus,
  } = useSelector((state) => state.product);

  // Coupon state.
  const {
    coupon = [],
    isCouponLoading,
    couponError,
    couponErrorStatus,
  } = useSelector((state) => state.coupon);

  // Fetch products.
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        page: 1,
        limit: 15,
        isFeatured: true,
      })
    );
  }, [dispatch]);

  // Fetch coupons.
  useEffect(() => {
    dispatch(
      fetchCoupon({
        pagination: {
          page: 1,
          limit: 15,
          isFeatured: true,
        },
      })
    );
  }, [dispatch]);

  // Autoplay and Chrome tab visibility recovery.
  useEffect(() => {
    let timer = null;
    let frame1 = null;
    let frame2 = null;

    const startTimer = () => {
      clearInterval(timer);

      if (document.visibilityState !== "visible") return;

      timer = setInterval(() => {
        setTrackIndex((prev) => prev + 1);
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearInterval(timer);
        return;
      }

      // Stop autoplay while restoring the carousel position.
      clearInterval(timer);

      // Disable transition to avoid an unwanted animation.
      setTransitionEnabled(false);

      // Restore the correct slide.
      setTrackIndex(currentRef.current + 1);

      // Re-enable transition after React updates the position.
      frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => {
          setTransitionEnabled(true);
          startTimer();
        });
      });
    };

    startTimer();

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      clearInterval(timer);

      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // Handle completed slide transition.
  const handleTransitionEnd = (e) => {
    if (
      e.target !== e.currentTarget ||
      e.propertyName !== "transform"
    ) {
      return;
    }

    // Reached cloned first slide.
    if (trackIndex === slideCount + 1) {
      setTransitionEnabled(false);
      setTrackIndex(1);
      setCurrent(0);
    }

    // Reached cloned last slide.
    else if (trackIndex === 0) {
      setTransitionEnabled(false);
      setTrackIndex(slideCount);
      setCurrent(slideCount - 1);
    }

    // Normal slide transition.
    else {
      setCurrent(trackIndex - 1);
    }
  };

  // Re-enable transition after an invisible position reset.
  useEffect(() => {
    if (!transitionEnabled) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [transitionEnabled]);

  // Indicator click.
  const handleIndicatorClick = (index) => {
    setCurrent(index);
    setTrackIndex(index + 1);
  };

  const totalError = productError || couponError;

  return (
    <>
      {/* Carousel */}
      <div className="relative w-full lg:h-[90vh] h-[40vh] md:h-[60vh] overflow-hidden bg-gray-100">

        {/* Sliding track */}
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex h-full w-full ${
            transitionEnabled
              ? "transition-transform duration-700 ease-in-out"
              : ""
          }`}
          style={{
            transform: `translateX(-${trackIndex * 100}%)`,
          }}
        >
          {slides.map((item, index) => (
            <div
              key={`${item.alt}-${index}`}
              className="w-full h-full shrink-0"
            >
              <CarouselSlide
                image={item.image}
                alt={item.alt}
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === current
                  ? "bg-white"
                  : "bg-white/50"
              }`}
              aria-label={`Slide ${index + 1}`}
              aria-current={
                index === current ? "true" : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Shop by category */}
      <div
        className="w-full h-fit bg-gradient-to-br text-white text-center sm:p-8 p-2 py-12 sm:py-24"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #2a2a3a 0%, #111118 50%, #0a0a0f 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="pb-10">
            <h1 className="text-3xl font-semibold">
              Shop By Category
            </h1>
            <p>Explore our wide range of products</p>
          </div>

          <SortCategory />
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="w-full text-center sm:p-8 p-4 py-12 sm:py-16">
          <div className="pb-10">
            <h1 className="text-3xl font-semibold mb-2">
              Featured Products
            </h1>
            <p>Handpicked favorites just for you</p>
          </div>

          {isProductLoading && !productError && (
            <div className="w-full h-[60vh] flex justify-center items-center">
              <CartLoading />
            </div>
          )}

          {products.length !== 0 &&
            !isProductLoading &&
            !productError && (
              <>
                <ProductCard products={products} />

                <div className="flex justify-center items-center mt-10">
                  <Button
                    variant="secondary"
                    className="w-fit"
                    onClick={() => navigate("/user/shop")}
                  >
                    view more
                  </Button>
                </div>
              </>
            )}

          <ErrorFallback
            loading={isProductLoading}
            error={totalError}
            statusCode={productErrorStatus}
          />
        </div>
      </div>

      {/* Coupons */}
      <div className="w-full text-center bg-gray-200 sm:p-10 p-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="pb-10">
            <h1 className="text-3xl font-semibold mb-2">
              Special Offers And Coupons
            </h1>
            <p>Save more with our exclusive deals</p>
          </div>

          <div className="py-10">
            {coupon.length === 0 && !couponError && (
              <span>No offers for today.</span>
            )}

            <CouponList
              coupons={coupon}
              loading={isCouponLoading}
              error={couponError}
            />
          </div>

          <div className="flex justify-center items-center">
            <Button
              className="w-fit"
              variant="secondary"
              onClick={() =>
                navigate("/user/profile/coupons")
              }
            >
              Show More
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;