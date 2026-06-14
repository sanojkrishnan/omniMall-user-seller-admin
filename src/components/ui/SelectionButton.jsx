import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/CN";
import { ChevronDown } from "lucide-react";

const variants = {
  primary:
    "w-full px-4 py-2.5 border text-sm rounded-lg shadow-lg placeholder:text-body flex gap-4 justify-between items-center transition-all duration-200 hover:bg-gray-50",
};

function SelectionButton({
  className,
  children,
  disabled,
  variant = "primary",
  placeholder = "Select an option",
  defaultValue = null
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className="relative w-fit">
      <button
        className={cn(
          variants[variant],
          disabled && "opacity-70 cursor-not-allowed hover:bg-white",
          className,
        )}
        onClick={() => !disabled && setShowOptions((prev) => !prev)}
        disabled={disabled}
      >
        <span className={cn(!selected && "text-gray-400")}>
          {selected ?? placeholder}
        </span>

        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-300",
            showOptions && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute top-full w-full left-0 z-10 bg-white border rounded-lg shadow-lg mt-1 overflow-hidden transition-all duration-300",
          showOptions ? "max-h-60 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {options.map((item, index) => (
          <div
            key={index}
            className="px-4 py-2.5 text-sm hover:bg-gray-100 cursor-pointer transition-colors duration-150"
            onMouseDown={() => {
              setSelected(item);
              setShowOptions(false);
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectionButton;
