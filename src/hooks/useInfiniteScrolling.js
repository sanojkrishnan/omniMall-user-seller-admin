import { useCallback, useEffect, useRef } from "react";

export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  onLoadMore,
  threshold = 0.5,
  recheckKey,
}) {
  const isFetchingRef = useRef(false);
  const hasNextPageRef = useRef(hasNextPage);
  const onLoadMoreRef = useRef(onLoadMore);
  const observerRef = useRef(null);
  const nodeRef = useRef(null);

  isFetchingRef.current = isLoading;
  hasNextPageRef.current = hasNextPage;
  onLoadMoreRef.current = onLoadMore;

  const triggerRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      nodeRef.current = node;
      if (!node) return;

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
    },
    [threshold],
  );

  // after each load or chunk, re-check whether the sentinel is still visible
  useEffect(() => {
    const node = nodeRef.current;
    const observer = observerRef.current;
    if (!node || !observer || isLoading || !hasNextPage) return;
    observer.unobserve(node);
    observer.observe(node);
  }, [isLoading, hasNextPage, recheckKey]);

  return triggerRef;
}
