import { useCallback, useRef } from "react";

export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  onLoadMore,
  threshold = 0.5,
}) {
  const isFetchingRef = useRef(false);
  const hasNextPageRef = useRef(hasNextPage);
  const onLoadMoreRef = useRef(onLoadMore);
  const observerRef = useRef(null);

  isFetchingRef.current = isLoading;
  hasNextPageRef.current = hasNextPage;
  onLoadMoreRef.current = onLoadMore;

  // Callback ref: fires the moment React attaches/detaches the DOM node,
  // regardless of *when* that happens (e.g. after async data loads).
  const triggerRef = useCallback((node) => {
    // clean up any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return; // node was unmounted

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPageRef.current &&
          !isFetchingRef.current
        ) {
          isFetchingRef.current = true;
          onLoadMoreRef.current?.();
        }
      },
      { threshold },
    );

    observer.observe(node);
    observerRef.current = observer;
  }, [threshold]);

  return triggerRef;
}