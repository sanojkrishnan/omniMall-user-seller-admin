import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/CN";
import { ChevronDown, Search } from "lucide-react";
import Loading from "./Loading";

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
  onChange,
  onOpen,
  loading,
  zIndex = 30,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Calculate dropdown position from button
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  // Replace the old scroll-close useEffect with this
  useEffect(() => {
    if (!showOptions) return;

    const updateOnScroll = () => {
      updatePosition(); //  recalculate position instead of closing
    };

    window.addEventListener("scroll", updateOnScroll, true);
    window.addEventListener("resize", updateOnScroll);
    return () => {
      window.removeEventListener("scroll", updateOnScroll, true);
      window.removeEventListener("resize", updateOnScroll);
    };
  }, [showOptions]);

  // Close on outside click (covers both button and portal dropdown)
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowOptions(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search when dropdown opens
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

  const dropdown = showOptions
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{ ...dropdownStyle, position: "fixed", zIndex }}
          className="bg-white border rounded-lg shadow-xl overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loading className="size-6" />
            </div>
          ) : (
            <>
              {addSearch && (
                <div className="flex items-center gap-2 px-3 py-2 border-b bg-white sticky top-0">
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
                        onChange?.(item);
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
            </>
          )}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        className={cn(
          variants[variant],
          disabled && "opacity-70 cursor-not-allowed hover:bg-white",
          className,
        )}
        onClick={() => {
          if (disabled) return;
          if (!showOptions) {
            updatePosition();
            setShowOptions(true);
            onOpen?.();
          } else {
            setShowOptions(false);
          }
        }}
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

      {dropdown}
    </div>
  );
}

export default SelectionButton;
