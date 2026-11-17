import { useEffect } from "react";

const useScrollLock = (open) => {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);
};

export default useScrollLock;
