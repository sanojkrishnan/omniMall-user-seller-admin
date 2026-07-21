// useActiveSegment.js
import { useLocation } from "react-router-dom";

export function useActiveSegment(afterSegment) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const idx = segments.indexOf(afterSegment);
  return idx !== -1 ? segments[idx + 1] : null;
}