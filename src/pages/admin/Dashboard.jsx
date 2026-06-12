import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FormCard } from "../../components/ui/FormCard";
import LineChart from "../../components/ui/LineChartCard";
import { useState } from "react";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 1000 },
  { month: "Mar", revenue: 12000 },
  { month: "Mar", revenue: 9000 },
];

const childrenDupe = [
  {
    cardName: "Total Revenue",
    rate: "25,000",
    percentage: "18",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 1000 },
      { month: "Mar", revenue: 12000 },
      { month: "Mar", revenue: 9000 },
    ],
    logo: "IndianRupee",
  },
  {
    cardName: "Total Orders",
    rate: "1100",
    percentage: "20",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
      { month: "Mar", revenue: 5000 },
      { month: "Mar", revenue: 5000 },
    ],
    logo: "ListOrder",
  },
  {
    cardName: "Total Users",
    rate: "1299",
    percentage: "13",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Feb", revenue: 3000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
    ],
    logo: "Users",
  },
  {
    cardName: "Total Sellers",
    rate: "500",
    percentage: "5",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Jan", revenue: 4000 },
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
    ],
    logo: "ChessBishop",
  },
  {
    cardName: "Total Products",
    rate: "120000",
    percentage: "50",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
    ],
    logo: "Target",
  },
  {
    cardName: "Pending Orders",
    rate: "129",
    percentage: "1",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
      { month: "Mar", revenue: 5000 },
    ],
    logo: "ClipboardClock",
  },
  {
    cardName: "Canceled Orders",
    rate: "12",
    percentage: "-13",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
      { month: "Mar", revenue: 5000 },
    ],
    logo: "Ban",
  },
  {
    cardName: "Today's Sales",
    rate: "9",
    percentage: "2",
    from: "From last week",
    data: [
      { month: "Jan", revenue: 4000 },
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 3000 },
      { month: "Mar", revenue: 5000 },
      { month: "Mar", revenue: 1000 },
    ],
    logo: "BadgeIndianRupee",
  },
];

function Dashboard() {
  const [pelletData, setPelletData] = useState(childrenDupe);

  const getBarColor = (index) => {
    if (index === 0) return "#534AB7"; // first bar has no previous
    return data[index].revenue < data[index - 1].revenue
      ? "#E24B4A" // down → red
      : "#534AB7"; // up or equal → purple
  };
  return (
    <>
      <div className="grid grid-cols-4 mb-6">
        {pelletData.map((children, index) => {
          return <LineChart key={index} children={children} index={index} />;
        })}
      </div>
      <div className="w-full h-[0.5px] border mb-6"></div>

      <div className="grid grid-cols-2">
        {/* Sales Overview */}
        <FormCard
          className={
            "flex-col items-center border min-w-[550px] p-2 justify-center"
          }
        >
          <div className=" p-2 mb-4 text-center border-b ">
            <h1>Sales Overview</h1>
          </div>
          <div className="w-[450px] mb-4 overflow-hidden h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {data.map((_, index) => (
                    <Cell key={index} fill={getBarColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full flex mb-2">
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Total Revenue</h5>
              <p className="text-lg font-bold mt-3">₹ 25,000,000</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Total Order</h5>
              <p className="text-lg font-bold mt-3">10000</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Average Order Value</h5>
              <p className="text-lg font-bold mt-3">₹ 1500</p>
            </div>
            <div className="w-full text-center text-xs p-2">
              <h5>Conversion Rate</h5>
              <p className="text-lg font-bold mt-3">10 %</p>
            </div>
          </div>
        </FormCard>
      </div>
    </>
  );
}

export default Dashboard;
