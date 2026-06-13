import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function BarChartCard({ data }) {
  const getBarColor = (index) => {
    if (index === 0) return "#534AB7"; // first bar has no previous
    return data[index].revenue < data[index - 1].revenue
      ? "#E24B4A" // down - red
      : "#534AB7"; // up or equal - purple
  };
  return (
    <>
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
    </>
  );
}

export default BarChartCard;
