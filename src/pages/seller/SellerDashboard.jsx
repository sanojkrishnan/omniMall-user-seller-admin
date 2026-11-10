import { Star, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BarChartCard from "../../components/ui/BarChartCard";
import { FormCard } from "../../components/ui/FormCard";
import LineChart from "../../components/ui/LineChartCard";
import PyChartCard from "../../components/ui/PyChartCard";
import SelectionButton from "../../components/ui/SelectionButton";
import { Button } from "../../components/ui/Button";

/* ----------------------------- static data ----------------------------- */

const filter = ["daily", "weekly", "monthly", "yearly"];

const pyColors = [
  "#00C49F", // Teal
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#8884D8", // Purple
  "#FF4560", // Red
  "#0088FE", // Blue
];

const PLACEHOLDER_IMG =
  "../../../public/logo and other utilities/lipstick_profile.jpg";

const inr = (n) => `₹ ${n.toLocaleString("en-IN")}`;

// tiny 5-point series for the KPI card sparklines
const spark = (values) =>
  ["Jan", "Feb", "Mar", "Apr", "May"].map((month, i) => ({
    month,
    revenue: values[i],
  }));

// KPI cards (same shape the admin LineChart card already expects)
const kpiCards = [
  {
    cardName: "Total Revenue",
    rate: "2,45,000",
    percentage: "18",
    from: "From last week",
    data: spark([4000, 3000, 5000, 7000, 9000]),
    logo: "IndianRupee",
  },
  {
    cardName: "Net Profit",
    rate: "68,500",
    percentage: "12",
    from: "From last week",
    data: spark([1200, 1500, 1300, 2100, 2600]),
    logo: "BadgeIndianRupee",
  },
  {
    cardName: "Total Orders",
    rate: "640",
    percentage: "20",
    from: "From last week",
    data: spark([4000, 3000, 5000, 5000, 6000]),
    logo: "ListOrder",
  },
  {
    cardName: "Products Sold",
    rate: "1,120",
    percentage: "15",
    from: "From last week",
    data: spark([3000, 3500, 3200, 4500, 5000]),
    logo: "Target",
  },
  {
    cardName: "Total Customers",
    rate: "512",
    percentage: "9",
    from: "From last week",
    data: spark([4000, 4000, 3000, 3500, 5000]),
    logo: "Users",
  },
  {
    cardName: "Pending Orders",
    rate: "38",
    percentage: "6",
    from: "From last week",
    data: spark([4000, 3000, 3000, 5000, 5000]),
    logo: "ClipboardClock",
  },
  {
    cardName: "Canceled & Returns",
    rate: "14",
    percentage: "-13",
    from: "From last week",
    data: spark([5000, 4000, 3000, 3000, 2000]),
    logo: "Ban",
  },
  {
    cardName: "Today's Sales",
    rate: "8,400",
    percentage: "22",
    from: "From last week",
    data: spark([4000, 4000, 3000, 5000, 6000]),
    logo: "BadgeIndianRupee",
  },
];

// monthly revenue + profit (sums: revenue 2,45,000, profit 68,500)
const monthly = [
  { month: "Jan", revenue: 30000, profit: 8200 },
  { month: "Feb", revenue: 36000, profit: 10100 },
  { month: "Mar", revenue: 33000, profit: 8900 },
  { month: "Apr", revenue: 45000, profit: 12600 },
  { month: "May", revenue: 42000, profit: 11400 },
  { month: "Jun", revenue: 59000, profit: 17300 },
];
const revenueData = monthly.map(({ month, revenue }) => ({ month, revenue }));
// BarChartCard reads the `revenue` key, so profit is passed under that key
const profitData = monthly.map(({ month, profit }) => ({
  month,
  revenue: profit,
}));

// product wise sales (top 5 by revenue)
const productSales = [
  {
    name: "Cotton T-Shirt",
    category: "Fashion",
    image: PLACEHOLDER_IMG,
    units: 290,
    revenue: 86710,
    profit: 23400,
    stock: 120,
  },
  {
    name: "Water Bottle",
    category: "Home & Kitchen",
    image: PLACEHOLDER_IMG,
    units: 240,
    revenue: 47760,
    profit: 14300,
    stock: 8,
  },
  {
    name: "Matte Lipstick",
    category: "Beauty",
    image: PLACEHOLDER_IMG,
    units: 210,
    revenue: 41790,
    profit: 13500,
    stock: 64,
  },
  {
    name: "Leather Wallet",
    category: "Accessories",
    units: 95,
    revenue: 28405,
    profit: 6900,
    stock: 0,
  },
  {
    name: "Phone Case",
    category: "Accessories",
    units: 150,
    revenue: 22350,
    profit: 7900,
    stock: 33,
  },
];
const OTHERS_REVENUE = 17985;

const productShare = [
  ...productSales.map((p) => ({ name: p.name, value: p.revenue })),
  { name: "Others", value: OTHERS_REVENUE },
];

const recentOrders = [
  {
    productName: "Cotton T-Shirt",
    customer: "Aarav S.",
    image: PLACEHOLDER_IMG,
    paymentType: "UPI",
    status: "pending",
  },
  {
    productName: "Water Bottle",
    customer: "Meera K.",
    image: PLACEHOLDER_IMG,
    paymentType: "COD",
    status: "pending",
  },
  {
    productName: "Matte Lipstick",
    customer: "Nisha R.",
    image: PLACEHOLDER_IMG,
    paymentType: "CARD",
    status: "delivered",
  },
  {
    productName: "Leather Wallet",
    customer: "Rohit P.",
    paymentType: "COD",
    status: "delivered",
  },
  {
    productName: "Phone Case",
    customer: "Anjali M.",
    paymentType: "UPI",
    status: "canceled",
  },
  {
    productName: "Cotton T-Shirt",
    customer: "Vishnu T.",
    paymentType: "CARD",
    status: "pending",
  },
  {
    productName: "Water Bottle",
    customer: "Sneha D.",
    paymentType: "UPI",
    status: "delivered",
  },
];

const ratingBreakdown = [
  { star: 5, count: 214 },
  { star: 4, count: 104 },
  { star: 3, count: 42 },
  { star: 2, count: 16 },
  { star: 1, count: 10 },
];
const totalReviews = ratingBreakdown.reduce((sum, r) => sum + r.count, 0);
const averageRating = (
  ratingBreakdown.reduce((sum, r) => sum + r.star * r.count, 0) / totalReviews
).toFixed(1);

const reviews = [
  {
    customer: "Aarav Sharma",
    product: "Cotton T-Shirt",
    rating: 5,
    date: "2 days ago",
    comment:
      "Fabric is soft and the fit is exactly as shown. Delivered a day early.",
  },
  {
    customer: "Meera Krishnan",
    product: "Water Bottle",
    rating: 4,
    date: "4 days ago",
    comment: "Keeps water cold all day. The cap is a little tight to open.",
  },
  {
    customer: "Nisha Rao",
    product: "Matte Lipstick",
    rating: 5,
    date: "1 week ago",
    comment: "Shade matches the photos and it lasts through lunch.",
  },
  {
    customer: "Rohit Pillai",
    product: "Leather Wallet",
    rating: 3,
    date: "1 week ago",
    comment: "Good stitching, but it arrived with a small scratch on one side.",
  },
  {
    customer: "Anjali Menon",
    product: "Phone Case",
    rating: 2,
    date: "2 weeks ago",
    comment: "Looks nice but it does not fit my phone model properly.",
  },
];

/* ---------------------------- small helpers ---------------------------- */

const statusClass = (status) =>
  status === "pending"
    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500"
    : status === "canceled"
      ? "bg-red-500/10 text-red-500 border-red-500"
      : "bg-green-500/10 text-green-500 border-green-500";

const stockInfo = (stock) =>
  stock === 0
    ? {
        label: "Out of stock",
        cls: "bg-red-500/10 text-red-500 border-red-500",
      }
    : stock <= 10
      ? {
          label: `Low (${stock})`,
          cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500",
        }
      : {
          label: `${stock} in stock`,
          cls: "bg-green-500/10 text-green-500 border-green-500",
        };

function Thumb({
  src,
  box = "w-8 h-8",
  icon = "size-4",
  rounded = "rounded-full",
}) {
  return src ? (
    <div className={`${box} overflow-hidden ${rounded} shrink-0`}>
      <img className="w-full h-full object-cover" src={src} alt="" />
    </div>
  ) : (
    <div
      className={`${box} overflow-hidden flex items-center justify-center border ${rounded} shrink-0`}
    >
      <TriangleAlert className={icon} />
    </div>
  );
}

function Stars({ rating, size = "size-3.5" }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${
            n <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

// bottom summary strip used inside the cards
function SummaryStrip({ items }) {
  return (
    <div className="w-full max-w-[500px] flex overflow-x-auto border-t mt-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex-1 min-w-[96px] text-center text-xs p-2 ${i < items.length - 1 ? "border-r" : ""}`}
        >
          <h5>{item.label}</h5>
          <p className="text-md font-bold mt-3 whitespace-nowrap">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function CardHeader({ title, onViewAll }) {
  return (
    <div className="w-full grid grid-cols-2 p-2 justify-items-end border-b">
      <h1 className="justify-self-start">{title}</h1>
      {onViewAll && (
        <Button
          className="w-fit text-xs mt-0 p-2 font-thin text-blue-500 border-none shadow-none"
          variant="secondary"
          onClick={onViewAll}
        >
          View All
        </Button>
      )}
    </div>
  );
}

/* ------------------------------ component ------------------------------ */

function SellerDashboard() {
  const navigate = useNavigate();

  const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = monthly.reduce((s, m) => s + m.profit, 0);
  const bestMonth = monthly.reduce((a, b) => (b.profit > a.profit ? b : a));

  return (
    <>
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 place-items-center mb-6">
        {kpiCards.map((children, index) => (
          <LineChart key={index} children={children} index={index} />
        ))}
      </div>
      <div className="w-full h-[0.5px] border mb-6"></div>
      <div className="flex justify-end mr-10">
        <SelectionButton className="w-fit" defaultValue={filter[0]}>
          {filter}
        </SelectionButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 place-items-center">
        {/* Sales overview */}
        <FormCard className="flex-col items-center border min-w-[400px] shadow-none p-2 justify-center mt-6">
          <div className="p-2 mb-4 text-center border-b">
            <h1>Sales Overview</h1>
          </div>
          <div className="w-[450px] mb-4 overflow-hidden h-[250px]">
            <BarChartCard data={revenueData} />
          </div>
          <SummaryStrip
            items={[
              { label: "Total Revenue", value: inr(totalRevenue) },
              { label: "Total Orders", value: "640" },
              {
                label: "Average Order Value",
                value: inr(Math.round(totalRevenue / 640)),
              },
              { label: "Conversion Rate", value: "6.2 %" },
            ]}
          />
        </FormCard>

        {/* Profit overview */}
        <FormCard className="flex-col items-center border min-w-[400px] shadow-none p-2 justify-center mt-6">
          <div className="p-2 mb-4 text-center border-b">
            <h1>Profit Overview</h1>
          </div>
          <div className="w-[450px] mb-4 overflow-hidden h-[250px]">
            <BarChartCard data={profitData} />
          </div>
          <SummaryStrip
            items={[
              { label: "Net Profit", value: inr(totalProfit) },
              {
                label: "Profit Margin",
                value: `${Math.round((totalProfit / totalRevenue) * 100)} %`,
              },
              {
                label: `Best Month (${bestMonth.month})`,
                value: inr(bestMonth.profit),
              },
              { label: "Pending Payout", value: inr(21400) },
            ]}
          />
        </FormCard>

        {/* Product based sales share */}
        <FormCard className="flex-col items-center shadow-none border min-w-[400px] p-2 justify-center mt-6">
          <div className="p-2 mb-4 text-center border-b">
            <h1>Product Based Sales Report</h1>
          </div>
          <div className="w-[400px] mb-4 overflow-hidden flex h-[250px]">
            <PyChartCard category={productShare} />
            <div>
              <ul>
                {productShare.map((item, index) => (
                  <li
                    key={item.name}
                    className="pt-2 grid grid-cols-3 items-center"
                  >
                    <div
                      className="w-2 h-2 mr-6 rounded-full justify-self-end"
                      style={{
                        backgroundColor: pyColors[index % pyColors.length],
                      }}
                    ></div>
                    <p className="col-span-2 text-xs">{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <SummaryStrip
            items={productSales.map((p) => ({
              label: p.name,
              value: inr(p.revenue),
            }))}
          />
        </FormCard>

        {/* Recent orders */}
        <FormCard className="flex-col shadow-none items-center border min-w-[400px] p-2 justify-between mt-6 h-[500px]">
          <CardHeader
            title="Recent Orders"
            onViewAll={() => navigate("/seller/orders")}
          />
          <div className="w-full flex-1 px-4">
            <ul className="w-full h-[370px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
              {recentOrders.map((item, index) => (
                <li
                  key={index}
                  className={`${index % 2 === 0 ? "bg-slate-50" : "bg-white"} py-2 px-2 w-full flex border-y justify-between items-center gap-2`}
                >
                  <Thumb src={item.image} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.productName}</p>
                    <p className="text-xs">Ordered by {item.customer}</p>
                  </div>
                  <p className="text-sm">{item.paymentType}</p>
                  <p
                    className={`text-xs border p-1 px-2 rounded-lg ${statusClass(item.status)}`}
                  >
                    {item.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <SummaryStrip
            items={[
              { label: "Pending Orders", value: "38" },
              { label: "Delivered", value: "588" },
              { label: "Canceled", value: "14" },
              { label: "Grand Total", value: "640" },
            ]}
          />
        </FormCard>
      </div>

      {/* product wise sales */}
      <div className="flex flex-col rounded-lg w-full items-center border min-w-[400px] p-2 justify-between mt-6">
        <CardHeader
          title="Product Wise Sales"
          onViewAll={() => navigate("/seller/products")}
        />
        <div className="w-full overflow-x-auto px-4">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-2 py-2 px-2 text-xs text-gray-500">
              <p>Product</p>
              <p className="text-right">Units Sold</p>
              <p className="text-right">Revenue</p>
              <p className="text-right">Profit</p>
              <p className="text-right">Stock</p>
            </div>
            <ul>
              {productSales.map((item, index) => {
                const stock = stockInfo(item.stock);
                return (
                  <li
                    key={item.name}
                    className={`${index % 2 === 0 ? "bg-slate-50" : "bg-white"} grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-2 py-2 px-2 border-y items-center`}
                  >
                    <div className="flex items-center gap-3">
                      <Thumb
                        src={item.image}
                        box="w-12 h-12"
                        icon="size-6"
                        rounded="rounded-none"
                      />
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs">{item.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-right">{item.units}</p>
                    <p className="text-sm text-right">{inr(item.revenue)}</p>
                    <p className="text-sm text-right">{inr(item.profit)}</p>
                    <div className="flex justify-end">
                      <p
                        className={`text-xs border p-1 px-2 rounded-lg whitespace-nowrap ${stock.cls}`}
                      >
                        {stock.label}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* customer reviews */}
      <div className="flex flex-col rounded-lg w-full items-center border min-w-[400px] p-2 mt-6 mb-6">
        <CardHeader
          title="Customer Reviews"
          onViewAll={() => navigate("/seller/reviews")}
        />
        <div className="w-full flex flex-col md:flex-row">
          {/* rating summary */}
          <div className="md:w-72 shrink-0 p-4 md:border-r border-b md:border-b-0">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-4xl font-bold">{averageRating}</p>
              <div>
                <Stars rating={Number(averageRating)} size="size-4" />
                <p className="text-xs mt-1">{totalReviews} reviews</p>
              </div>
            </div>
            <ul className="space-y-2">
              {ratingBreakdown.map((row) => (
                <li key={row.star} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{row.star}</span>
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${(row.count / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* review list */}
          <div className="flex-1 px-4 md:h-[360px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
            <ul className="w-full">
              {reviews.map((review, index) => (
                <li
                  key={index}
                  className={`${index % 2 === 0 ? "bg-slate-50" : "bg-white"} py-3 px-2 w-full flex gap-3 border-y`}
                >
                  <div className="w-8 h-8 shrink-0 rounded-full border flex items-center justify-center text-xs font-semibold">
                    {review.customer
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {review.customer}
                        </p>
                        <p className="text-xs">on {review.product}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Stars rating={review.rating} />
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{review.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerDashboard;
