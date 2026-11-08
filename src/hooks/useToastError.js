import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function useToastError({
  errorMessage,
  fallbackErrorMessage = "Something went wrong",
}) {
  const shownRef = useRef(null);

  useEffect(() => {
    if (!errorMessage) {
      shownRef.current = null; // error cleared, so allow the same message again
      return;
    }
    if (shownRef.current === errorMessage) return;

    shownRef.current = errorMessage;
    toast.error(errorMessage || fallbackErrorMessage, {
      toastId: errorMessage || fallbackErrorMessage,
    });
  }, [errorMessage, fallbackErrorMessage]);
}
