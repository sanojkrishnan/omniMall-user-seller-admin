import P from "./P";
import { cn } from "../../utils/CN";

// Full class strings so Tailwind can detect them (no dynamic string building)
const COLORS = {
  admin: {
    card: "border-[#ECE0E3]",
    iconBox: "bg-[#F8ECEE] text-[#60001A]",
    label: "text-[#96828A]",
    value: "text-[#241318]",
  },
  user: {
    card: "border-[#E5E5E5]",
    iconBox: "bg-[#F5F5F5] text-[#111111]",
    label: "text-[#8A8A8A]",
    value: "text-[#171717]",
  },
};

export function StatCard({ label, value, icon: Icon, admin, className }) {
  const c = admin ? COLORS.admin : COLORS.user;

  return (
    <div
      className={cn(
        "flex-1 rounded-xl p-4 flex items-center gap-3 bg-white border",
        c.card,
        className,
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
          c.iconBox,
        )}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <P
          className={cn(
            "text-[11px] uppercase tracking-wide font-medium",
            c.label,
          )}
        >
          {label}
        </P>
        <div className={cn("text-xl font-semibold tabular-nums", c.value)}>
          {value}
        </div>
      </div>
    </div>
  );
}
