// small stat block used in the header strip
export function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-wide text-white/60">
        {label}
      </span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}

// section wrapper used throughout the body
export function Section({ icon: Icon, title, children }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-[#5f0000]" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">
        {value}
      </span>
    </div>
  );
}

export function Pill({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#5f0000]/[0.06] text-[#5f0000] text-xs font-medium border border-[#5f0000]/10">
      {children}
    </span>
  );
}
