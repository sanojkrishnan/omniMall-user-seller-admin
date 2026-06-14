import { TriangleAlert } from "lucide-react";
import BarChartCard from "../../components/ui/BarChartCard";
import { FormCard } from "../../components/ui/FormCard";
import LineChart from "../../components/ui/LineChartCard";
import PyChartCard from "../../components/ui/PyChartCard";
import SelectionButton from "../../components/ui/SelectionButton";
import { Button } from "../../components/ui/Button";

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
    percentage: "19",
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
    percentage: "22",
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

const products = [
  {
    productName: "lenovo laptop",
    productImage:
      "../../../public/logo and other utilities/lipstick_profile.jpg",
    category: "Electronics",
    paymentType: "COD",
    status: "pending",
  },
  {
    productName: "lenovo laptop",
    productImage:
      "../../../public/logo and other utilities/lipstick_profile.jpg",
    category: "Electronics",
    paymentType: "COD",
    status: "pending",
  },
  {
    productName: "lenovo laptop",
    productImage:
      "../../../public/logo and other utilities/lipstick_profile.jpg",
    category: "Electronics",
    paymentType: "COD",
    status: "pending",
  },
  {
    productName: "lenovo laptop",
    productImage:
      "../../../public/logo and other utilities/lipstick_profile.jpg",
    category: "Electronics",
    paymentType: "COD",
    status: "pending",
  },
  {
    productName: "lenovo laptop",
    productImage:
      "../../../public/logo and other utilities/lipstick_profile.jpg",
    category: "Electronics",
    paymentType: "COD",
    status: "pending",
  },
  {
    productName: "lenovo laptop",
    category: "Electronics",
    paymentType: "COD",
    status: "delivered",
  },
  {
    productName: "lenovo laptop",
    category: "Electronics",
    paymentType: "COD",
    status: "pending",
  },
  {
    productName: "lenovo laptop",
    category: "Electronics",
    paymentType: "COD",
    status: "canceled",
  },
  {
    productName: "lenovo laptop",
    category: "Electronics",
    paymentType: "COD",
    status: "pending",
  },
];

const category = [
  { name: "Electronics", value: 400 },
  { name: "Fashion", value: 100 },
  { name: "Home Appliances", value: 300 },
  { name: "Beverages", value: 50 },
  { name: "Beauty", value: 1000 },
  { name: "Accessories", value: 200 },
];

const pyColors = [
  "#00C49F", // Teal
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#8884D8", // Purple
  "#FF4560", // Red
  "#0088FE", // Blue
];

const filter = ["daily", "weekly", "monthly", "yearly"];

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 place-items-center mb-6">
        {childrenDupe.map((children, index) => {
          return <LineChart key={index} children={children} index={index} />;
        })}
      </div>
      <div className="w-full h-[0.5px] border mb-6"></div>
      <div className="flex justify-end mr-10">
        <SelectionButton defaultValue={filter[0]}>{filter}</SelectionButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 place-items-center ">
        {/* Sales Overview */}
        <FormCard
          className={
            "flex-col items-center border min-w-[400px] p-2 justify-center mt-6"
          }
        >
          <div className=" p-2 mb-4 text-center border-b ">
            <h1>Sales Overview</h1>
          </div>
          <div className="w-[450px] mb-4 overflow-hidden h-[250px]">
            <BarChartCard data={data} />
          </div>

          <div className="w-full flex mb-2  overflow-x-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent max-w-[500px]">
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Total Revenue</h5>
              <p className="text-md font-bold mt-3">₹ 25,000,000</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Total Order</h5>
              <p className="text-md font-bold mt-3">10000</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5 className="w-28">Average Order Value</h5>
              <p className="text-md font-bold mt-3">₹ 1500</p>
            </div>
            <div className="w-full text-center text-xs p-2">
              <h5>Conversion Rate</h5>
              <p className="text-md font-bold mt-3">10 %</p>
            </div>
          </div>
        </FormCard>

        {/* category py chart  */}
        <FormCard
          className={
            "flex-col items-center border min-w-[400px] p-2 justify-center mt-6"
          }
        >
          <div className=" p-2 mb-4 text-center border-b ">
            <h1>Category Based Sales Report</h1>
          </div>
          <div className="w-[400px] mb-4 overflow-hidden flex h-[250px]">
            <PyChartCard category={category} />
            <div>
              <ul className="">
                {category.map((item, index) => (
                  <li
                    key={index}
                    className="pt-2 grid grid-cols-3 items-center"
                  >
                    <div
                      className={`w-2 h-2 mr-6 rounded-full justify-self-end`}
                      style={{
                        backgroundColor: pyColors[index % pyColors.length],
                      }}
                    ></div>
                    <p className="col-span-2">{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full flex mb-2 overflow-x-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent max-w-[500px]">
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Electronics</h5>
              <p className="w-20 text-md font-bold mt-3">₹ 25,000,000</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Fashion</h5>
              <p className="w-12 text-md font-bold mt-3">₹ 10000</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5 className="w-24">Home Appliances</h5>
              <p className="text-md font-bold mt-3">₹ 1500</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Beauty</h5>
              <p className="w-12 text-md font-bold mt-3">₹ 12000</p>
            </div>
            <div className="w-full border-r text-center text-xs p-2">
              <h5>Accessories</h5>
              <p className="text-md font-bold mt-3">₹ 1500</p>
            </div>
            <div className="w-full text-center text-xs p-2">
              <h5>Beverages</h5>
              <p className="text-md font-bold mt-3">₹ 10000</p>
            </div>
          </div>
        </FormCard>
        {/* recent orders  */}
        <FormCard className="flex-col overflow-y-none items-center border min-w-[400px] p-2 justify-between mt-6 h-[500px]">
          {/* Header */}
          <div className="w-full grid grid-cols-2 p-2 justify-items-end border-b">
            <h1 className="justify-self-start">Recent Orders</h1>
            <Button
              className={
                "w-fit text-xs mt-0 p-2 font-thin text-blue-500 border-none shadow-none"
              }
              variant="secondary"
            >
              View All
            </Button>
          </div>

          <div className="w-full flex-1  px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
            <ul className="w-full h-[370px] overflow-y-hidden">
              {products.map(
                (item, index) =>
                  index <= 6 && (
                    <li
                      key={index}
                      className="py-2 w-full flex border-y justify-between items-center"
                    >
                      {item.productImage ? (
                        <div className="w-8 h-8 overflow-hidden rounded-full">
                          <img
                            className="w-full h-full object-cover rounded-full"
                            src={item.productImage}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 overflow-hidden flex items-center justify-center border rounded-full">
                          <TriangleAlert className="size-4" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs">{item.category}</p>
                      </div>
                      <p className="text-sm">{item.paymentType}</p>
                      <p
                        className={`text-xs border p-1 px-2 rounded-lg ${
                          item.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500"
                            : item.status === "canceled"
                              ? "bg-red-500/10 text-red-500 border-red-500"
                              : "bg-green-500/10 text-green-500 border-green-500"
                        }`}
                      >
                        {item.status}
                      </p>
                    </li>
                  ),
              )}
            </ul>
          </div>
          <div className="w-[450px] flex overflow-x-auto border-t mt-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200">
            {[
              { label: "Pending Orders", value: "129" },
              { label: "Delivered", value: "1200" },
              { label: "Canceled", value: "11" },
              { label: "Grand Total", value: "1340" },
            ].map((cat, i, arr) => (
              <div
                key={i}
                className={`flex-1 text-center text-xs p-2 ${i < arr.length - 1 ? "border-r" : ""}`}
              >
                <h5>{cat.label}</h5>
                <p className="text-md font-bold mt-3 whitespace-nowrap">
                  {cat.value}
                </p>
              </div>
            ))}
          </div>
        </FormCard>
        {/* Sellers List  */}
        <FormCard className="flex-col overflow-y-none items-center border min-w-[400px] p-2 justify-between mt-6 h-[500px]">
          {/* Header */}
          <div className="w-full grid grid-cols-2 p-2 justify-items-end border-b">
            <h1 className="justify-self-start">Top Sellers</h1>
            <Button
              className={
                "w-fit text-xs mt-0 p-2 font-thin text-blue-500 border-none shadow-none"
              }
              variant="secondary"
            >
              View All
            </Button>
          </div>

          <div className="w-full flex-1  px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
            <ul className="w-full h-[370px] overflow-y-hidden">
              {products.map(
                (item, index) =>
                  index <= 6 && (
                    <li
                      key={index}
                      className="py-2 w-full flex border-y justify-between items-center"
                    >
                      {item.productImage ? (
                        <div className="w-8 h-8 overflow-hidden rounded-full">
                          <img
                            className="w-full h-full object-cover rounded-full"
                            src={item.productImage}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 overflow-hidden flex items-center justify-center border rounded-full">
                          <TriangleAlert className="size-4" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs">{item.category}</p>
                      </div>
                      <p className="text-sm">{item.paymentType}</p>
                      <p
                        className={`text-xs border p-1 px-2 rounded-lg ${
                          item.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500"
                            : item.status === "canceled"
                              ? "bg-red-500/10 text-red-500 border-red-500"
                              : "bg-green-500/10 text-green-500 border-green-500"
                        }`}
                      >
                        {item.status}
                      </p>
                    </li>
                  ),
              )}
            </ul>
          </div>
          <div className="w-[450px] flex overflow-x-auto border-t mt-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200">
            {[
              { label: "Pending Orders", value: "129" },
              { label: "Delivered", value: "1200" },
              { label: "Canceled", value: "11" },
              { label: "Grand Total", value: "1340" },
            ].map((cat, i, arr) => (
              <div
                key={i}
                className={`flex-1 text-center text-xs p-2 ${i < arr.length - 1 ? "border-r" : ""}`}
              >
                <h5>{cat.label}</h5>
                <p className="text-md font-bold mt-3 whitespace-nowrap">
                  {cat.value}
                </p>
              </div>
            ))}
          </div>
        </FormCard>
      </div>

      {/* top selling product */}
      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] p-2 justify-between mt-6 h-[500px]">
        {/* Header */}
        <div className="w-full grid grid-cols-2 p-2 justify-items-end border-b">
          <h1 className="justify-self-start">Top Selling Product</h1>
          <Button
            className="w-fit text-xs mt-0 p-2 font-thin text-blue-500 border-none shadow-none"
            variant="secondary"
          >
            View All
          </Button>
        </div>

        <div className="w-full flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
          <ul className="w-full">
            {products.map(
              (item, index) =>
                index <= 6 && (
                  <li
                    key={index}
                    className="py-2 w-full flex border-y justify-between items-center"
                  >
                    {item.productImage ? (
                      <div className="w-12 h-12 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={item.productImage}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 overflow-hidden flex items-center justify-center border rounded-full">
                        <TriangleAlert className="size-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">
                        {item.productName}
                      </p>
                      <p className="text-xs">{item.category}</p>
                    </div>
                    <p className="text-sm">{item.paymentType}</p>
                    <p
                      className={`text-xs border p-1 px-2 rounded-lg ${
                        item.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500"
                          : item.status === "canceled"
                            ? "bg-red-500/10 text-red-500 border-red-500"
                            : "bg-green-500/10 text-green-500 border-green-500"
                      }`}
                    >
                      {item.status}
                    </p>
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
