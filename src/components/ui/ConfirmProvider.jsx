import { FormCard } from "./FormCard";
import { Button } from "./Button";
import P from "./P";
import { useEffect, useRef } from "react";

function ConfirmProvider({
  children,
  variant = "user",
  open,
  onResult,
  setOpen,
}) {
  const confirmCardRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        open &&
        confirmCardRef.current &&
        !confirmCardRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      className={`${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-all duration-300 flex items-center justify-center bg-black/5 absolute inset-0 z-10`}
    >
      <FormCard
        ref={confirmCardRef}
        className={`${
          open ? "scale-100" : "scale-0"
        } transition-all duration-300  border-[0.5px] border-black/5 `}
      >
        <P>{children}</P>
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={() => onResult(true)}
            className={`${variant === "user" ? "" : "bg-[#5f0000]"} w-fit`}
          >
            Confirm
          </Button>
          <Button
            onClick={() => onResult(false)}
            variant="secondary"
            className={`${
              variant === "user" ? "" : "border-[#5f0000] text-[#5f0000]"
            } w-fit`}
          >
            Cancel
          </Button>
        </div>
      </FormCard>
    </div>
  );
}

export default ConfirmProvider;
