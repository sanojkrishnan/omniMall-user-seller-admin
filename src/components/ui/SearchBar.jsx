import { Filter } from "lucide-react";
import { Button } from "./Button";
import { useEffect, useRef, useState } from "react";
import SortCategory from "./SortCategory";
import PriceRangeFilter from "./PriceRangeFilter";
import { cn } from "../../utils/CN";

const variants = {
  primary: "backdrop-blur-lg border rounded-2xl border-black",
};

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

export const SearchBar = ({
  className,
  disabled,
  variant = "primary",
  value,
  onChange,
  onFilterApply,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (buttonRef.current && buttonRef.current.contains(e.target)) return;
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col m-4 mb-8 mt-6 border-b-[0.5px] pb-8">
      <div className="flex items-center justify-center relative">
        <input
          disabled={disabled}
          placeholder="Search here..."
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            "p-4 w-full",
            variants[variant],
            disabled && "opacity-70 cursor-not-allowed",
            className,
          )}
        />
        <Button
          ref={buttonRef}
          className={"w-fit px-6 m-0 ml-4"}
          onClick={(e) => {
            e.stopPropagation();
            setFilterOpen((prev) => !prev);
          }}
        >
          <Filter className="size-4" /> Filter
        </Button>

        {/* Dropdown panel */}
        <div
          ref={filterRef}
          className={cn(
            "absolute top-[160%] left-0 p-8 w-full rounded-b-xl z-30 overflow-y-auto custom-scrollbar",
            "transition-all duration-500 origin-top border-[0.5px] border-t-0 bg-white shadow-lg",
            filterOpen
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-0 pointer-events-none",
          )}
          style={{ height: "700px" }}
        >
          {/* Category sort */}
          <div
            className="bg-black sm:p-8 text-white p-4 rounded-xl"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, #2a2a3a 0%, #111118 50%, #0a0a0f 100%)",
            }}
          >
            <div className="flex items-center justify-center">
              <h5 className="text-center">Category</h5>
            </div>
            <SortCategory categoryList={categoryList} />
          </div>

          {/* Price range filter */}
          <PriceRangeFilter
            onApply={(payload) => {
              onFilterApply?.(payload);
              setFilterOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
