import { useEffect, useRef } from "react";

/**
 * Reusable infinite-scroll hook.
 *
 * Watches a "trigger" element (rendered at the bottom of a list) and
 * calls onLoadMore() when it becomes visible — as long as there's more
 * to load and a fetch isn't already in flight.
 *
 * @param {Object} options
 * @param {boolean} options.hasNextPage - whether more pages exist
 * @param {boolean} options.isLoading - current loading state (from Redux, etc.)
 * @param {() => void} options.onLoadMore - called to fetch the next page
 * @param {string} [options.triggerId="load-more-trigger"] - id of the DOM element to observe
 * @param {number} [options.threshold=0.5] - IntersectionObserver threshold
 *
 * @returns {string} triggerId - render <div id={triggerId} /> at the bottom of your list
 *
 * Usage:
 *   const triggerId = useInfiniteScroll({
 *     hasNextPage,
 *     isLoading: isProductLoading,
 *     onLoadMore: () => setPage((p) => p + 1),
 *   });
 *   ...
 *   <div id={triggerId} className="h-10" />
 */
export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  onLoadMore,
  triggerId = "load-more-trigger",
  threshold = 0.5,
}) {
  // Ref mirrors isLoading so the IntersectionObserver callback always
  // reads the latest value synchronously, instead of a stale closure
  // from when the observer was created. This is what prevents the
  // "scroll fires twice, page jumps by 2" bug.
  const isFetchingRef = useRef(false);

  useEffect(() => {
    isFetchingRef.current = isLoading;
  }, [isLoading]);

  // Keep the latest onLoadMore in a ref too, so the observer effect
  // below doesn't need onLoadMore in its dependency array (which would
  // otherwise re-create the observer on every render if the caller
  // passes an inline arrow function).
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingRef.current) {
          isFetchingRef.current = true; // lock immediately, don't wait for state
          onLoadMoreRef.current?.();
        }
      },
      { threshold },
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [hasNextPage, triggerId, threshold]);

  return triggerId;
}
