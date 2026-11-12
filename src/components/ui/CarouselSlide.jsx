
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { ImageOff, RotateCw } from "lucide-react";
import Loading from "./Loading";

export default function CarouselSlide({ image, alt }) {
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  const imgRef = useRef(null);

  const src = attempt
    ? `${image}${image.includes("?") ? "&" : "?"}retry=${attempt}`
    : image;

  // Check whether the image has loaded successfully.
  const checkImage = () => {
    const img = imgRef.current;

    if (!img) return;

    if (img.complete) {
      setStatus(img.naturalWidth > 0 ? "loaded" : "error");
    }
  };

  useEffect(() => {
    setStatus("loading");

    const img = imgRef.current;

    if (img?.complete) {
      checkImage();
    }

    // Recheck image when returning to the tab.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkImage();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [src]);

  const handleRetry = () => {
    setStatus("loading");
    setAttempt((prev) => prev + 1);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`w-full h-full object-cover ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Loading */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading className="size-20" />
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div
          className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-3 text-center px-4"
          role="alert"
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />

            <div className="relative rounded-full bg-red-500/10 p-4 animate-shake">
              <ImageOff className="size-8 sm:size-10 text-red-500" />
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm sm:text-base">
              Couldn't load this image
            </p>

            <p className="text-xs sm:text-sm text-gray-500">
              Check your connection and try again.
            </p>
          </div>

          <Button
            variant="secondary"
            className="w-fit flex items-center gap-2 text-sm"
            onClick={handleRetry}
          >
            <RotateCw className="size-4" />
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}