import { Filter, Plus, TriangleAlert } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../redux/slice/productSlice";
import { useEffect } from "react";

// const sampleProducts = [
//   {
//     productName: "lenovo laptop",
//     productImage:
//       "../../../public/logo and other utilities/lipstick_profile.jpg",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "pending",
//   },
//   {
//     productName: "lenovo laptop",
//     productImage:
//       "../../../public/logo and other utilities/lipstick_profile.jpg",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "pending",
//   },
//   {
//     productName: "lenovo laptop",
//     productImage:
//       "../../../public/logo and other utilities/lipstick_profile.jpg",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "pending",
//   },
//   {
//     productName: "lenovo laptop",
//     productImage:
//       "../../../public/logo and other utilities/lipstick_profile.jpg",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "pending",
//   },
//   {
//     productName: "lenovo laptop",
//     productImage:
//       "../../../public/logo and other utilities/lipstick_profile.jpg",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "pending",
//   },
//   {
//     productName: "lenovo laptop",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "delivered",
//   },
//   {
//     productName: "lenovo laptop",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "pending",
//   },
//   {
//     productName: "lenovo laptop",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "canceled",
//   },
//   {
//     productName: "lenovo laptop",
//     category: "Electronics",
//     paymentType: "COD",
//     status: "pending",
//   },
// ];

function Products() {
  const dispatch = useDispatch();

  const { products, page, totalPages, isLoading, error } = useSelector(
    (state) => state.product,
  );

  useEffect(() => {
    dispatch(fetchAllProducts({ page: 1, limit: 15 }));
  }, [dispatch]);

  useEffect(() => {
    console.log("print products", products);
  }, [products]);

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
        <div className="w-full flex-1 overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th colSpan={6} className="text-lg p-6 border-b">
                  Top Selling Products
                </th>
              </tr>
              <tr className="bg-slate-100 border-b">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">MRP</th>
                <th className="p-3 text-left">Seller Price</th>
              </tr>
            </thead>

            <tbody>
              {products.length !== 0 ? (
                products.map(
                  (item, index) =>
                    index <= 6 && (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50"
                        } hover:bg-slate-200 cursor-pointer border-b`}
                      >
                        <td className="p-3">
                          {item.productImage ? (
                            <div className="w-12 h-12 overflow-hidden rounded-md">
                              <img
                                className="w-full h-full object-cover"
                                src={item.productImage}
                                alt={item.productName}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center border rounded-full">
                              <TriangleAlert className="size-6" />
                            </div>
                          )}
                        </td>

                        <td className="p-2">
                          <p className="font-semibold text-sm">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                        </td>

                        <td className="p-3 text-sm">{item.category}</td>

                        <td className="p-3 text-sm">{item.stock}</td>

                        <td className="p-3">
                          <span className="text-xs border p-1 px-2 rounded-lg">
                            ₹{item.mrp}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs border p-1 px-2 rounded-lg">
                            ₹{item.offerPrice}
                          </span>
                        </td>
                      </tr>
                    ),
                )
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-5 text-gray-500">
                    No Products Available I'm Sorry... )
                  </td>
                </tr>
              )}
            </tbody>

            <thead>
              <tr>
                <th colSpan={6} className="text-lg p-6 border-b">
                  All Products
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length !== 0 ? (
                products.map(
                  (item, index) =>
                    index <= 6 && (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-slate-50" : "bg-white"
                        } hover:bg-slate-200 cursor-pointer border-y`}
                      >
                        <td className="p-2">
                          {item.productImage ? (
                            <div className="w-12 h-12 overflow-hidden">
                              <img
                                className="w-full h-full object-cover"
                                src={item.productImage}
                                alt={item.productName}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 overflow-hidden flex items-center justify-center border rounded-full">
                              <TriangleAlert className="size-6" />
                            </div>
                          )}
                        </td>

                        <td className="p-2">
                          <p className="font-semibold text-sm">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                        </td>
                        <td className="p-3 text-sm">{item.category}</td>

                        <td className="p-2 text-sm">{item.stock}</td>

                        <td className="p-2">
                          <span className="text-xs border p-1 px-2 rounded-lg">
                            ₹{item.mrp}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-xs border p-1 px-2 rounded-lg">
                            ₹{item.offerPrice}
                          </span>
                        </td>
                      </tr>
                    ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-5 text-gray-500 text-sm font-thin"
                  >
                    No Products Available I'm Sorry... )
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Products;
