import P from "./P";

const PRIMARY = "#60001A";
const PRIMARY_TINT = "#F8ECEE";
const BORDER = "#ECE0E3";
const MUTED = "#96828A";

export function StatCard({ label, value, icon: Icon }) {
  return (
    <div
      className="flex-1 rounded-xl p-4 flex items-center gap-3 bg-white"
      style={{ border: `1px solid ${BORDER}` }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
        style={{ background: PRIMARY_TINT, color: PRIMARY }}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <P
          className="text-[11px] uppercase tracking-wide font-medium"
          style={{ color: MUTED }}
        >
          {label}
        </P>
        <div
          className="text-xl font-semibold tabular-nums"
          style={{ color: "#241318" }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
