import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/CN";
import { Button } from "./Button";

const RANGE_MIN = 0;
const RANGE_MAX = 100000; // ₹1,00,000
const RANGE_STEP = 100;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100000;

function PriceRangeFilter({ onApply, colorVariants, setFilterValues }) {
  const [minVal, setMinVal] = useState(DEFAULT_MIN);
  const [maxVal, setMaxVal] = useState(DEFAULT_MAX);
  const [sortOrder, setSortOrder] = useState("price_desc");
  const [sort, setSort] = useState("newest");
  const fillRef = useRef();

  // Keep the slider fill track in sync
  useEffect(() => {
    if (!fillRef.current) return;
    const pMin = ((minVal - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
    const pMax = ((maxVal - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
    fillRef.current.style.left = pMin + "%";
    fillRef.current.style.width = pMax - pMin + "%";
  }, [minVal, maxVal]);

  function handleMinRange(e) {
    const val = Math.min(Number(e.target.value), maxVal - RANGE_STEP);
    setMinVal(val);
  }
  function handleMaxRange(e) {
    const val = Math.max(Number(e.target.value), minVal + RANGE_STEP);
    setMaxVal(val);
  }
  function handleMinInput(e) {
    const raw = Number(e.target.value) || RANGE_MIN;
    const val = Math.max(RANGE_MIN, Math.min(raw, maxVal - RANGE_STEP));
    setMinVal(val);
  }
  function handleMaxInput(e) {
    const raw = Number(e.target.value) || RANGE_MAX;
    const val = Math.min(RANGE_MAX, Math.max(raw, minVal + RANGE_STEP));
    setMaxVal(val);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterValues((prev) => {
        return {
          ...prev,
          minPrice: minVal,
          maxPrice: maxVal,
          priceSort: sortOrder,
        };
      });
    }, 500); // wait until the user stops dragging before triggering a fetch

    return () => clearTimeout(timer);
  }, [minVal, maxVal, sortOrder]);
  // Shared thumb styles (Tailwind arbitrary variants)
  const thumbCls = `
    absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-[18px]   [&::-webkit-slider-thumb]:h-[18px]
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white   [&::-webkit-slider-thumb]:border-2
    [&::-webkit-slider-thumb]:border-black
    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
    [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.15)]
    [&::-moz-range-thumb]:w-[18px]       [&::-moz-range-thumb]:h-[18px]
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-white       [&::-moz-range-thumb]:border-2
    [&::-moz-range-thumb]:border-black   [&::-moz-range-thumb]:cursor-pointer
    [&::-moz-range-thumb]:pointer-events-auto
  `;

  const sortBtnCls = (active) =>
    cn(
      "flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-all duration-200",
      active
        ? "bg-white text-black border-white"
        : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/40",
    );

  return (
    <div
      className="mt-6 rounded-xl p-4 sm:p-8 text-white"
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
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <h5 className="text-center tracking-wide">Price Range</h5>
      </div>

      {/* Min / Max number inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Min price", val: minVal, handler: handleMinInput },
          { label: "Max price", val: maxVal, handler: handleMaxInput },
        ].map(({ label, val, handler }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 uppercase tracking-wider">
              {label}
            </label>
            <div className="relative">
              {/* Indian Rupee symbol */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
                ₹
              </span>
              <input
                type="number"
                value={val}
                onChange={handler}
                min={RANGE_MIN}
                max={RANGE_MAX}
                step={RANGE_STEP}
                className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm
                           focus:outline-none focus:border-white/60
                           [appearance:textfield]
                           [&::-webkit-inner-spin-button]:appearance-none
                           [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dual range slider */}
      <div className="mb-1">
        <div className="relative h-1 bg-white/20 rounded-full mx-2 mt-4 mb-3">
          {/* Active fill — white on dark bg */}
          <div
            ref={fillRef}
            className="absolute h-full bg-white rounded-full pointer-events-none"
            style={{ left: "0%", width: "100%" }}
          />
          <input
            type="range"
            min={RANGE_MIN}
            max={RANGE_MAX}
            step={RANGE_STEP}
            value={minVal}
            onChange={handleMinRange}
            className={thumbCls}
          />
          <input
            type="range"
            min={RANGE_MIN}
            max={RANGE_MAX}
            step={RANGE_STEP}
            value={maxVal}
            onChange={handleMaxRange}
            className={thumbCls}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-1 mt-3">
          <span>₹{RANGE_MIN.toLocaleString("en-IN")}</span>
          <span>₹{RANGE_MAX.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-5" />

      {/* Sort order toggle */}
      <div className="mb-5">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Sort order
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSortOrder("price_asc")}
            className={sortBtnCls(sortOrder === "price_asc")}
          >
            ↑ Low to high
          </button>
          <button
            onClick={() => setSortOrder("price_desc")}
            className={sortBtnCls(sortOrder === "price_desc")}
          >
            ↓ High to low
          </button>
        </div>
        {colorVariants === "admin" && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => setSort("newest")}
              className={sortBtnCls(sort === "newest")}
            >
              Newest on top
            </button>
            <button
              onClick={() => setSort("oldest")}
              className={sortBtnCls(sort === "oldest")}
            >
              Oldest on top
            </button>
          </div>
        )}
      </div>

      {/* Apply — sends clean payload to parent */}
      <Button
        className={"bg-white text-black"}
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
        className={"border-white"}
        variant="secondary"
        onClick={() =>
          setFilterValues({
            category: "",
            minPrice: "",
            maxPrice: "",
            priceSort: "",
          })
        }
      >
        Reset filter
      </Button>
    </div>
  );
}

export default PriceRangeFilter;
