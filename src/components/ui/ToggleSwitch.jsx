import { useState } from "react";

export default function ToggleSwitch({ initialState = false, onChange }) {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    const nextState = !isOn;
    setIsOn(nextState);
    if (onChange) {
      onChange(nextState);
    }
  };

  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        className="sr-only"
      />

      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 bg-gray-200
        `}
      >
        <div
          className={`absolute top-[2px] left-[2px]  rounded-full h-5 w-5 transition-all duration-300 transform ${
            isOn ? "translate-x-full bg-[#5f0000]" : "bg-[#b17b7b]"
          }`}
        ></div>
      </div>
    </label>
  );
}
