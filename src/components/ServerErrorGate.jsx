import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorFallback from "./ui/ErrorFallback";

function ServerErrorGate({ children }) {
  const [error, setError] = useState(null); // { statusCode, message }
  const { pathname } = useLocation();

  // show the fallback whenever apiClient reports a 5xx
  useEffect(() => {
    const handler = (e) => setError(e.detail);
    window.addEventListener("server-error", handler);
    return () => window.removeEventListener("server-error", handler);
  }, []);

  // navigating away clears it
  useEffect(() => {
    setError(null);
  }, [pathname]);

  return (
    <>
      {children}
      {error && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
          <ErrorFallback error={error} />
        </div>
      )}
    </>
  );
}

export default ServerErrorGate;