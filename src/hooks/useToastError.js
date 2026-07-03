import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function useToastError({
  errorMessage,
  fallbackErrorMessage = "Something went wrong",
}) {
  const shownRef = useRef(null);

  useEffect(() => {
    if (!errorMessage) return;
    if (shownRef.current === errorMessage) return;

    shownRef.current = errorMessage;
    toast.error(errorMessage || fallbackErrorMessage);
  }, [errorMessage]);
}
