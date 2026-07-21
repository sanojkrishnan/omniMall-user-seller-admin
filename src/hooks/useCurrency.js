export function useCurrency() {
  return (n) => `\u20b9${n.toLocaleString("en-IN")}`;
}