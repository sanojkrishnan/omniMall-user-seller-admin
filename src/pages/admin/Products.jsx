import { Filter, Plus, TriangleAlert } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";

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

function Products() {
  return (
    <>
      <div className="flex items-center">
        <SearchBar />
        <Button className={"w-fit px-6 m-0 ml-4 bg-[#5f0000]"}>
          <Filter className="size-4 " /> Filter
        </Button>
      </div>
      <div className="flex justify-start">
        <Button className={"bg-[#5f0000] w-fit px-4"}>
          <Plus /> Add Products
        </Button>
      </div>
      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
        {/* Header */}
        <div className="w-full flex justify-center items-center p-6 border-b">
          <h1 className="justify-self-start font-bold">Top Selling Products</h1>
        </div>

        <div className="w-full flex-1 overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
          <ul className="w-full">
            {products.length !== 0 ? (
              products.map(
                (item, index) =>
                  index <= 6 && (
                    <li
                      key={index}
                      className={` ${index % 2 === 0 ? "bg-slate-50" : "bg-white"} hover:bg-slate-200 cursor-pointer py-2 px-2 w-full flex border-y justify-between items-center`}
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
              )
            ) : (
              <div
                className="flex justify-center items-center w-full p-5 text-gray-500 text-sm font-thin
              "
              >
                No Products Available I'm Sorry... ) ;{" "}
              </div>
            )}

            <div className="w-full flex justify-center items-center p-6 border-b">
              <h1 className="justify-self-start font-bold">All Products</h1>
            </div>
          </ul>
          <ul className="w-full">
            {products.length !== 0 ? (
              products.map(
                (item, index) =>
                  index <= 6 && (
                    <li
                      key={index}
                      className={` ${index % 2 === 0 ? "bg-slate-50" : "bg-white"} hover:bg-slate-200 cursor-pointer py-2 px-2 w-full flex border-y justify-between items-center`}
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
              )
            ) : (
              <div
                className="flex justify-center items-center w-full p-5 text-gray-500 text-sm font-thin
              "
              >
                No Products Available I'm Sorry... ) ;{" "}
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Products;
