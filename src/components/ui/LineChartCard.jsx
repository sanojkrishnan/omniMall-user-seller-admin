import {
  BadgeIndianRupee,
  Ban,
  ChessBishop,
  ClipboardClock,
  IndianRupee,
  ListOrdered,
  Target,
  Users,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import P2 from "./P2";
import H3 from "./H3";

function LineChart({ children, index }) {
  const isDown =
    children.data[children.data.length - 1].revenue < children.data[0].revenue;

  const color = isDown ? "#E24B4A" : "#22c55e";

  return (
    <div
      className={
        "w-fit mb-4 px-4 p-2 border overflow-hidden shadow-lg bg-gradient-to-br  from-white/0 via-white/40 to-white/0 backdrop-blur-md rounded-xl"
      }
    >
      <div className="w-fit">
        <div className="flex mt-4">
          <div
            className={`rounded-full p-2 w-fit h-fit flex justify-center items-center ${index === 0 && "bg-green-100"} ${index === 1 && "bg-blue-100"} ${index === 2 && " bg-purple-100"} ${index === 3 && " bg-orange-100"} ${index === 4 && " bg-yellow-100"} ${index === 5 && " bg-green-100"} ${index === 6 && " bg-red-100"} ${index === 7 && " bg-sky-100"}`}
          >
            {children.logo === "IndianRupee" && (
              <IndianRupee className="size-8 font-extrabold text-green-500" />
            )}
            {children.logo === "ListOrder" && (
              <ListOrdered className="size-8 font-extrabold text-blue-500" />
            )}
            {children.logo === "Users" && (
              <Users className="size-8 font-extrabold text-purple-500" />
            )}
            {children.logo === "ChessBishop" && (
              <ChessBishop className="size-8 font-extrabold text-orange-400" />
            )}
            {children.logo === "Target" && (
              <Target className="size-8 font-extrabold text-yellow-500" />
            )}
            {children.logo === "ClipboardClock" && (
              <ClipboardClock className="size-8 font-extrabold text-green-500" />
            )}
            {children.logo === "Ban" && (
              <Ban className="size-8 font-extrabold text-red-500" />
            )}
            {children.logo === "BadgeIndianRupee" && (
              <BadgeIndianRupee className="size-8 font-extrabold text-sky-400" />
            )}
          </div>
          <div className="ml-4">
            <P2 className="md:text-xs">{children.cardName}</P2>
            <H3 className="">
              {index === 0 || index === 7 ? "₹" : ""} {children.rate}
            </H3>
            <P2>
              <span
                className={`${Number(children.percentage) > 0 ? "text-green-500" : "text-red-500"} font-semibold text-sm`}
              >
                {children.percentage} %
              </span>{" "}
              <span className="text-xs">{children.from}</span>
            </P2>
          </div>
          <div className="w-12 h-12 ml-2 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={children.data}>
                <defs>
                  <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area
                  type="natural"
                  dataKey="revenue"
                  stroke={color}
                  strokeWidth={3}
                  fill={!isDown ? "url(#colorUp)" : "url(#colorDown)"}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LineChart;
