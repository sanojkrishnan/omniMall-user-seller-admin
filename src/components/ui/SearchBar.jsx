import { Filter, X } from "lucide-react";
import { Button } from "./Button";
import { useEffect, useRef, useState } from "react";
import SortCategory from "./SortCategory";
import PriceRangeFilter from "./PriceRangeFilter";
import { cn } from "../../utils/CN";
import H5 from "./H5";

const variants = {
  primary: "backdrop-blur-lg border rounded-2xl border-black",
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 1000000;

export const SearchBar = ({
  setFilterValues,
  className,
  disabled,
  variant = "primary",
  colorVariants = "user",
  value,
  onChange,
  onFilterApply,
  filterValues,
  filterOn = "products",
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();
  const buttonRef = useRef();
  const [minVal, setMinVal] = useState(DEFAULT_MIN);
  const [maxVal, setMaxVal] = useState(DEFAULT_MAX);
  const [sortOrder, setSortOrder] = useState("price_desc");

  const onApply = (payload) => {
    onFilterApply?.(payload);
    setFilterOpen(false);
  };

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

  const clearFilter = (key) => {
    setFilterValues((prev) => ({ ...prev, [key]: "" }));
  };
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
            "p-2 sm:p-4 w-full",
            variants[variant],
            disabled && "opacity-70 cursor-not-allowed",
            className,
          )}
        />
        <Button
          ref={buttonRef}
          className={` ${colorVariants === "admin" && "bg-[#60001A]"} w-fit px-6 m-0 ml-4`}
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
            "absolute top-[180%] left-0 p-8 w-full rounded-b-xl z-30 overflow-y-auto custom-scrollbar",
            "transition-all duration-500 origin-top border-[0.5px] border-t-0 bg-white shadow-lg",
            filterOpen
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-0 pointer-events-none",
          )}
        >
          {/* Category sort */}
          <div
            className={`bg-black ${colorVariants === "user" ? "bg-black" : "bg-[#60001A]"} sm:p-8 text-white p-4 rounded-xl`}
            style={
              colorVariants === "user"
                ? {
                    background:
                      "radial-gradient(ellipse at 50% 0%, #2a2a3a 0%, #111118 50%, #0a0a0f 100%)",
                  }
                : {
                    background:
                      "radial-gradient(ellipse at 50% 0%, #ad002e 0%, #60001A 50%, #510015 100%)",
                  }
            }
          >
            <div className="flex items-center justify-center">
              <H5>Category</H5>
            </div>
            <SortCategory setFilterValues={setFilterValues} />
          </div>

          {/* Price range filter */}
          {filterOn === "products" && (
            <PriceRangeFilter
              setFilterValues={setFilterValues}
              colorVariants={colorVariants}
              minVal={minVal}
              maxVal={maxVal}
              setMinVal={setMinVal}
              setMaxVal={setMaxVal}
            />
          )}

          <div>
            {/* Apply — sends clean payload to parent */}
            <Button
              className={`${colorVariants === "admin" ? "bg-[#60001A]" : "bg-black"} text-white`}
              variant="secondary"
              onClick={() =>
                onApply?.({
                  minPrice: minVal, // number  — use as query param ?minPrice=
                  maxPrice: maxVal, // number  — use as query param ?maxPrice=
                  sortOrder, // "asc" | "desc" — use as ?sortOrder=
                })
              }
            >
              Apply filter
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setMinVal(DEFAULT_MIN);
                setMaxVal(DEFAULT_MAX);
                setSortOrder("price_desc");
                setFilterValues((prev) => ({
                  ...prev,
                  category: "",
                  minPrice: "",
                  maxPrice: "",
                  priceSort: "",
                }));
              }}
            >
              Reset filter
            </Button>
          </div>
        </div>
      </div>
      {/* filter chips */}
      <div className="px-4 flex gap-2 mt-1">
        {filterValues.category !== "" && (
          <div
            className={` ${colorVariants === "admin" ? "bg-[#60001A]" : "bg-black"} pl-4 pr-2 text-white rounded-full text-center flex items-center justify-between p-1`}
          >
            <span>{filterValues.category}</span>{" "}
            <button
              type="button"
              onClick={() => clearFilter("category")}
              aria-label="Remove category filter"
            >
              <X className="size-4 ml-4" />
            </button>
          </div>
        )}

        {filterValues.minPrice !== 0 ||
          (filterValues.maxPrice !== 1000000 && (
            <div
              className={` ${colorVariants === "admin" ? "bg-[#60001A]" : "bg-black"} pl-4 pr-2 text-white rounded-full text-center flex items-center justify-between p-1`}
            >
              <span>
                ₹{filterValues.minPrice} - ₹{filterValues.maxPrice}
              </span>{" "}
              <button
                type="button"
                onClick={() => clearFilter("minPrice")}
                aria-label="Remove min price filter"
              >
                <X className="size-4 ml-4" />
              </button>
            </div>
          ))}

        {filterValues.priceSort !== "" && (
          <div
            className={` ${colorVariants === "admin" ? "bg-[#60001A]" : "bg-black"} pl-4 pr-2 text-white rounded-full text-center flex items-center justify-between p-1`}
          >
            <span>price: Ascending</span>{" "}
            <button
              type="button"
              onClick={() => clearFilter("priceSort")}
              aria-label="Remove price sort filter"
            >
              <X className="size-4 ml-4" />
            </button>
          </div>
        )}

        {filterValues.sort && (
          <div
            className={` ${colorVariants === "admin" ? "bg-[#60001A]" : "bg-black"} pl-4 pr-2 text-white rounded-full text-center flex items-center justify-between p-1`}
          >
            <span>{filterValues.sort}</span>{" "}
            <button
              type="button"
              onClick={() => clearFilter("sort")}
              aria-label="Remove sort filter"
            >
              <X className="size-4 ml-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
