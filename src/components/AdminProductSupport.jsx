export function AdminStockBar({ stock, max = 100 }) {
  const pct = Math.min(100, Math.round((stock / max) * 100));
  const barColor =
    stock === 0
      ? "bg-[#5f0000]"
      : stock <= 10
        ? "bg-[#a97327]"
        : "bg-[#3f6b52]";
  return (
    <div className="flex items-center gap-2">
      <div className="w-[72px] h-[5px] bg-[#e8e1df] rounded-[3px] overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-[#241a1a]">{stock}</span>
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <span className="w-1.5 h-1.5 bg-[#5f0000] inline-block" />
      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8a7873]">
        {children}
      </span>
      <div className="flex-1 h-px bg-[#e8e1df]" />
    </div>
  );
}

export function FieldRow({ label, value, mono }) {
  return (
    <div className="flex justify-between py-[9px] text-[13px] border-t border-[#e8e1df]">
      <span className="text-[#8a7873]">{label}</span>
      <span
        className={`text-right max-w-[62%] break-all ${
          mono
            ? "font-mono text-[12.5px] font-normal"
            : "text-[13px] font-medium"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
