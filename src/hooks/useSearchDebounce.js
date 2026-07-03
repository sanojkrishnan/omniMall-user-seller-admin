import { useEffect, useRef } from "react";

export function useSearchDebounce({
  searchInput,
  setSearch,
  setPage,
  setIsSearching,
  isLoading,
}) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, setSearch, setPage, setIsSearching]);

  useEffect(() => {
    if (!isLoading) {
      setIsSearching(false);
    }
  }, [isLoading, setIsSearching]);
}
