import { Filter } from "lucide-react";
import { cn } from "../../utils/CN";
import { Button } from "./Button";
import { useEffect, useRef, useState } from "react";

const variants = {
  primary: "backdrop-blur-lg border rounded-2xl border-[#5f0000]",
};

export const SearchBar = ({
  className,
  disabled,
  variant = "primary",
  value,
  onChange,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      // if click is on the button, let onClick handle it
      if (buttonRef.current && buttonRef.current.contains(e.target)) return;
      // if click is outside the dropdown, close it
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col m-4 mb-8 mt-6 border-b-[0.5px] pb-8">
      {/* Search row */}
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

        {/* Filter dropdown — absolute so it doesn't push content down */}
        <div
          ref={filterRef}
          className={cn(
            "absolute top-[160%] left-0 w-full rounded-b-xl z-30",
            "transition-all duration-300 origin-top border-[0.5px] border-t-0 bg-white shadow-lg",
            filterOpen
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-0 pointer-events-none",
          )}
          style={{
            height: "500px",
          }}
        >
          {/* filter content goes here */}
        </div>
      </div>
    </div>
  );
};
