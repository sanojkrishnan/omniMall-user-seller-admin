// Walks up the DOM from `el` to find the nearest ancestor that actually
// scrolls (overflow-y auto/scroll AND has overflow content). Returns null
// if none found (falls back to just using the viewport).
export function getScrollParent(el) {
  let node = el?.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight;
    if (isScrollable) return node;
    node = node.parentElement;
  }
  return null;
}

// True if `triggerEl`'s bounding box is still (at least partially) within
// the visible bounds of its scrollable container (or the viewport, if no
// scrollable ancestor is found).
export function isTriggerVisible(triggerEl) {
  if (!triggerEl) return false;
  const rect = triggerEl.getBoundingClientRect();
  const container = getScrollParent(triggerEl);

  const bounds = container
    ? container.getBoundingClientRect()
    : { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth };

  return (
    rect.bottom > bounds.top &&
    rect.top < bounds.bottom &&
    rect.right > bounds.left &&
    rect.left < bounds.right
  );
}
