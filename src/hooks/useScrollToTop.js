import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to the top whenever the route (pathname) changes.
 * Must be used inside a <BrowserRouter> / <RouterProvider>.
 */
export default function useScrollToTop() {
  // Current URL path, e.g. "/address" or "/product/123".
  // Changes every time the user navigates to a different page.
  const { pathname } = useLocation();

  // Runs once on mount.
  // By default the browser tries to restore the old scroll position on
  // back/forward navigation. Setting it to "manual" tells the browser
  // not to do that, so we control scrolling ourselves.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Runs every time the pathname changes (i.e. on each page navigation).
  // Jumps to the top-left of the page so a new page doesn't open
  // halfway down because of the previous page's scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Hooks that only run side effects don't need to return anything,
  // so this line is optional and can be removed.
  return null;
}
