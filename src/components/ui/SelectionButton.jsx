import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/CN";
import { ChevronDown, Search } from "lucide-react";

const variants = {
  primary:
    "w-full px-4 py-2.5 border text-sm rounded-lg shadow-lg placeholder:text-body flex gap-4 justify-between items-center transition-all duration-200 hover:bg-gray-50",
};

function SelectionButton({
  className,
  children,
  disabled,
  addSearch = false,
  variant = "primary",
  placeholder = "Select an option",
  defaultValue = null,
  onChange, // callback to notify parent of selection
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowOptions(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // focus search input when dropdown opens
  useEffect(() => {
    if (showOptions) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [showOptions]);

  const options = Array.isArray(children) ? children : [children];

  const filtered = options.filter((item) =>
    String(item).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative w-fit">
      {/* Trigger button */}
      <button
        className={cn(
          variants[variant],
          disabled && "opacity-70 cursor-not-allowed hover:bg-white",
          className,
        )}
        onClick={() => !disabled && setShowOptions((prev) => !prev)}
        disabled={disabled}
        type="button"
      >
        <span className={cn("text-sm truncate", !selected && "text-gray-400")}>
          {selected ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-300",
            showOptions && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute top-full w-full left-0 z-10 bg-white border rounded-lg shadow-lg mt-1 overflow-hidden transition-all duration-300",
          showOptions
            ? "max-h-72 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        {/* Search box inside dropdown */}
        {addSearch && (
          <div className="flex items-center gap-2 px-3 py-2 border-b sticky top-0 bg-white">
            <Search className="size-4 text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
        )}

        {/* Options list */}
        <div className="overflow-y-auto max-h-52 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200">
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150",
                  selected === item
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50",
                )}
                onMouseDown={() => {
                  setSelected(item);
                  setShowOptions(false);
                  onChange?.(item); // notify parent
                }}
              >
                {item}
              </div>
            ))
          ) : (
            <div className="px-4 py-4 text-sm text-gray-400 text-center">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectionButton;
