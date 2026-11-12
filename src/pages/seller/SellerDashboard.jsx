import { Star, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BarChartCard from "../../components/ui/BarChartCard";
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

// files in /public are served from the site root (not a relative path)
const PLACEHOLDER_IMG = "/logo and other utilities/lipstick_profile.jpg";

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

// order totals (pending + delivered + canceled = total)
const ORDER_TOTAL = 640;
const ORDER_PENDING = 38;
const ORDER_CANCELED = 14;
const ORDER_DELIVERED = ORDER_TOTAL - ORDER_PENDING - ORDER_CANCELED;

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
          className={`${size} ${n <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

// bottom summary strip used inside the cards
function SummaryStrip({ items }) {
  return (
    <div className="w-full flex overflow-x-auto border-t mt-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex-1 min-w-[96px] text-center text-xs p-2 ${i < items.length - 1 ? "border-r" : ""}`}
        >
          <h5>{item.label}</h5>
          <p className="text-sm sm:text-base font-bold mt-3 whitespace-nowrap">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function CardHeader({ title, onViewAll }) {
  return (
    <div className="w-full flex items-center justify-between p-2 border-b gap-2">
      <h1 className="truncate">{title}</h1>
      {onViewAll && (
        <Button
          className="w-fit shrink-0 text-xs mt-0 p-2 font-thin text-blue-500 border-none shadow-none"
          variant="secondary"
          onClick={onViewAll}
        >
          View All
        </Button>
      )}
    </div>
  );
}

// shared card shell (min-w-0 stops grid children from overflowing)
const CARD =
  "flex flex-col min-w-0 shadow-md items-center border w-full rounded-lg p-3 sm:p-6 justify-center mt-4 sm:mt-6";

/* ------------------------------ component ------------------------------ */

function SellerDashboard() {
  const navigate = useNavigate();

  const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = monthly.reduce((s, m) => s + m.profit, 0);
  const bestMonth = monthly.reduce((a, b) => (b.profit > a.profit ? b : a));

  const outOfStock = productSales.filter((p) => p.stock === 0);
  const lowStock = productSales.filter((p) => p.stock > 0 && p.stock <= 10);

  return (
    <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 overflow-x-hidden">
      {/* page title */}
      <div className="py-4 sm:py-6 px-2">
        <h1 className="text-lg sm:text-xl font-bold">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Sales, profit, orders and reviews for your store.
        </p>
      </div>

      {/* restock alert */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-yellow-500 bg-yellow-500/10 rounded-lg p-3 mb-4 sm:mb-6 text-sm"
        >
          <div className="flex items-start gap-2 min-w-0">
            <TriangleAlert className="size-4 mt-0.5 text-yellow-500 shrink-0" />
            <p className="min-w-0 break-words">
              {outOfStock.length > 0 && (
                <>
                  <b>{outOfStock.map((p) => p.name).join(", ")}</b> out of
                  stock.{" "}
                </>
              )}
              {lowStock.length > 0 && (
                <>
                  <b>{lowStock.map((p) => p.name).join(", ")}</b> running low.
                </>
              )}
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full sm:w-fit mt-0 text-xs p-2"
            onClick={() => navigate("/seller/products")}
          >
            Restock
          </Button>
        </div>
      )}

      {/* KPI cards: 1 col -> 2 cols -> 4 cols */}
      <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-4 gap-x-3 mb-4 sm:mb-6">
        {kpiCards.map((card, index) => (
          <LineChart key={card.cardName} children={card} index={index} />
        ))}
      </div>
      <div className="w-full h-[0.5px] border mb-4 sm:mb-6"></div>

      {/* TODO: wire this filter to the charts / API */}
      <div className="flex justify-end sm:mr-10">
        <SelectionButton className="w-fit" defaultValue={filter[0]}>
          {filter}
        </SelectionButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-2">
        {/* Sales overview */}
        <div className={CARD}>
          <div className="p-2 mb-4 text-center border-b">
            <h1>Sales Overview</h1>
          </div>
          <div className="w-full max-w-[450px] min-w-0 mb-4 overflow-hidden h-[250px]">
            <BarChartCard data={revenueData} />
          </div>
          <SummaryStrip
            items={[
              { label: "Total Revenue", value: inr(totalRevenue) },
              { label: "Total Orders", value: String(ORDER_TOTAL) },
              {
                label: "Average Order Value",
                value: inr(Math.round(totalRevenue / ORDER_TOTAL)),
              },
              { label: "Conversion Rate", value: "6.2 %" },
            ]}
          />
        </div>

        {/* Profit overview */}
        <div className={CARD}>
          <div className="p-2 mb-4 text-center border-b">
            <h1>Profit Overview</h1>
          </div>
          <div className="w-full max-w-[450px] min-w-0 mb-4 overflow-hidden h-[250px]">
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
        </div>

        {/* Product based sales share: legend goes under the pie on mobile */}
        <div className={CARD}>
          <div className="p-2 mb-4 text-center border-b">
            <h1>Product Based Sales Report</h1>
          </div>
          <div className="w-full max-w-[420px] mb-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 min-w-0 h-[220px]">
              <PyChartCard category={productShare} innerRadius={"50%"} />
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-2 shrink-0">
              {productShare.map((item, index) => (
                <li key={item.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: pyColors[index % pyColors.length],
                    }}
                  />
                  <span className="whitespace-nowrap">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <SummaryStrip
            items={productSales.map((p) => ({
              label: p.name,
              value: inr(p.revenue),
            }))}
          />
        </div>

        {/* Recent orders */}
        <div className={CARD}>
          <CardHeader
            title="Recent Orders"
            onViewAll={() => navigate("/seller/orders")}
          />
          <div className="w-full flex-1 sm:px-4">
            <ul className="w-full h-[320px] sm:h-[370px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
              {recentOrders.map((item, index) => (
                <li
                  key={index}
                  className={`${index % 2 === 0 ? "bg-slate-50" : "bg-white"} py-2 px-2 w-full flex border-y justify-between items-center gap-2`}
                >
                  <Thumb src={item.image} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs truncate">
                      Ordered by {item.customer}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm shrink-0">
                    {item.paymentType}
                  </p>
                  <p
                    className={`text-xs border p-1 px-2 rounded-lg shrink-0 ${statusClass(item.status)}`}
                  >
                    {item.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <SummaryStrip
            items={[
              { label: "Pending Orders", value: String(ORDER_PENDING) },
              { label: "Delivered", value: String(ORDER_DELIVERED) },
              { label: "Canceled", value: String(ORDER_CANCELED) },
              { label: "Grand Total", value: String(ORDER_TOTAL) },
            ]}
          />
        </div>
      </div>

      {/* product wise sales: table on md+, stacked cards on mobile */}
      <div className="flex flex-col min-w-0 shadow-md rounded-lg w-full items-center border p-2 mt-4 sm:mt-6">
        <CardHeader
          title="Product Wise Sales"
          onViewAll={() => navigate("/seller/products")}
        />
        <div className="w-full sm:px-2 md:px-4">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-2 py-2 px-2 text-xs text-gray-500">
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
                  className={`${index % 2 === 0 ? "bg-slate-50" : "bg-white"} grid grid-cols-3 md:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-x-2 gap-y-3 py-3 md:py-2 px-2 border-y items-center`}
                >
                  <div className="col-span-3 md:col-span-1 flex items-center gap-3 min-w-0">
                    <Thumb
                      src={item.image}
                      box="w-12 h-12"
                      icon="size-6"
                      rounded="rounded-none"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs">{item.category}</p>
                    </div>
                  </div>

                  <p className="text-sm md:text-right">
                    <span className="md:hidden block text-xs text-gray-500">
                      Units
                    </span>
                    {item.units}
                  </p>
                  <p className="text-sm md:text-right">
                    <span className="md:hidden block text-xs text-gray-500">
                      Revenue
                    </span>
                    {inr(item.revenue)}
                  </p>
                  <p className="text-sm md:text-right">
                    <span className="md:hidden block text-xs text-gray-500">
                      Profit
                    </span>
                    {inr(item.profit)}
                  </p>

                  <div className="col-span-3 md:col-span-1 flex md:justify-end">
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

      {/* customer reviews */}
      <div className="flex flex-col min-w-0 shadow-md rounded-lg w-full items-center border p-2 mt-4 sm:mt-6 mb-6">
        <CardHeader
          title="Customer Reviews"
          onViewAll={() => navigate("/seller/reviews")}
        />
        <div className="w-full flex flex-col md:flex-row">
          {/* rating summary */}
          <div className="md:w-72 shrink-0 p-4 md:border-r border-b md:border-b-0">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-3xl sm:text-4xl font-bold">{averageRating}</p>
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
          <div className="flex-1 min-w-0 px-0 sm:px-4 max-h-[440px] md:max-h-none md:h-[360px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
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
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-x-2 gap-y-1">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {review.customer}
                        </p>
                        <p className="text-xs">on {review.product}</p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1">
                        <Stars rating={review.rating} />
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-sm mt-2 break-words">{review.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
