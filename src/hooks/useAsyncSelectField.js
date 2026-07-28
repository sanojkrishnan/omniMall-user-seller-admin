// hooks/useAsyncSelectField.js
import { useEffect, useRef, useState, useCallback } from "react";
import { ASYNC_SELECT_SOURCES } from "../utils/asyncSelectSources";
import { useSearchDebounce } from "./useSearchDebounce";

function getIdOf(v) {
  if (v == null) return v;
  return typeof v === "object" ? (v._id ?? v.id) : v;
}

// If the raw value already arrived as populated objects, we can label
// them immediately without waiting on fetchById.
function inlineLabelsFrom(rawValue, getLabel) {
  const arr = Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : [];
  const out = {};
  arr.forEach((v) => {
    if (v && typeof v === "object") {
      const id = getIdOf(v);
      if (id) out[id] = getLabel(v);
    }
  });
  return out;
}

export function useAsyncSelectField(entityKey, rawValue) {
  const source = ASYNC_SELECT_SOURCES[entityKey];

  // Normalized: always plain ID strings, regardless of whether rawValue
  // was ["id1","id2"] or [{_id:"id1", name:"..."}]
  const normalizedIds = (Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : [])
    .filter(Boolean)
    .map(getIdOf);

  const [items, setItems] = useState([]);
  const [labelCache, setLabelCache] = useState(() =>
    source ? inlineLabelsFrom(rawValue, source.getLabel) : {},
  );

  // searchInput: what the user is typing right now (bound to the text
  // field, updates every keystroke).
  // search: the debounced value that actually triggers a fetch, set by
  // useSearchDebounce ~500ms after typing stops.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // exposed so component can trigger initial load on open
  const requestId = useRef(0);

  const load = useCallback(
    async (nextPage, nextSearch, replace) => {
      if (!source) return;
      const id = ++requestId.current;
      setLoading(true);
      try {
        const { items: newItems, hasNextPage: next } = await source.fetchPage({
          page: nextPage,
          search: nextSearch,
        });
        if (id !== requestId.current) return;
        setItems((prev) => (replace ? newItems : [...prev, ...newItems]));
        setHasNextPage(next);
        setLabelCache((prev) => {
          const copy = { ...prev };
          newItems.forEach((it) => {
            copy[source.getId(it)] = source.getLabel(it);
          });
          return copy;
        });
      } catch (e) {
        console.error(`[AsyncSelect:${entityKey}] fetchPage failed`, e);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [source, entityKey],
  );

  // Debounces searchInput -> search (also resets page to 1 once the
  // debounced value lands), and tracks isSearching while the timer is
  // pending / the resulting fetch is still in flight.
  useSearchDebounce({
    searchInput,
    setSearch,
    setPage,
    setIsSearching,
    isLoading: loading,
  });

  // Fires the actual fetch once the debounced search value changes —
  // but only while the menu is open (no point fetching for a closed field).
  useEffect(() => {
    if (!open) return;
    load(1, search, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, open]);

  // Resolve labels for ids not yet in cache (covers plain-ID-string case)
  const selectedKey = normalizedIds.join(",");
  useEffect(() => {
    if (!source?.fetchById) return;
    const missing = normalizedIds.filter((id) => id && !labelCache[id]);
    if (missing.length === 0) return;
    let cancelled = false;
    Promise.all(
      missing.map((id) =>
        source
          .fetchById(id)
          .then((item) => (item ? [id, source.getLabel(item)] : null))
          .catch((e) => {
            console.error(`[AsyncSelect:${entityKey}] fetchById(${id}) failed`, e);
            return null;
          }),
      ),
    ).then((pairs) => {
      if (cancelled) return;
      setLabelCache((prev) => {
        const copy = { ...prev };
        pairs.forEach((p) => p && (copy[p[0]] = p[1]));
        return copy;
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  function loadMore() {
    if (loading || !hasNextPage) return;
    const next = page + 1;
    setPage(next);
    load(next, search, false);
  }

  function openMenu() {
    setOpen(true);
    if (items.length === 0) {
      setPage(1);
      load(1, search, true);
    }
  }

  return {
    source,
    items,
    labelCache,
    normalizedIds,
    // Exposed as "search"/"setSearch" so the input field stays snappy
    // (every keystroke updates immediately); actual fetching is driven
    // by the debounced value internally.
    search: searchInput,
    setSearch: setSearchInput,
    isSearching,
    loadMore,
    hasNextPage,
    loading: loading || isSearching,
    open,
    openMenu,
    closeMenu: () => setOpen(false),
  };
}