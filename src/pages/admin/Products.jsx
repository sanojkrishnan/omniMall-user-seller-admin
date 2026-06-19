import { Filter, Plus, TriangleAlert } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { clearError, fetchAllProducts } from "../../redux/slice/productSlice";
import CartLoading from "../../components/ui/CartLoading";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SingleProductList from "../../components/SingleProductList";

function Products() {
  const dispatch = useDispatch();

  const { products, page, totalPages, isProductLoading, productError } =
    useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);

  const [openProduct, setOpenProduct] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [hadError, setHadError] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts({ page: 1, limit: 15 }));
  }, [dispatch]);

  useEffect(() => {
    if (products.length !== 0) {
      console.log("print products", products);
    }
    if (productError) {
      toast.error(productError);
      setHadError(true);
      dispatch(clearError());
    }
  }, [products, productError, dispatch]);
  return (
    <>
      <div className="flex items-center">
        <div
          className={`${openProduct ? "scale-100" : "scale-0"} transition-all duration-300 fixed inset-0 z-50 flex items-center justify-center`}
        >
          <SingleProductList
            openProduct={openProduct}
            setOpenProduct={setOpenProduct}
            product={singleProduct}
            setProduct={setSingleProduct}
          />
        </div>

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
          {isProductLoading && !productError && (
            <div className="w-full h-[70vh] flex items-center justify-center">
              <CartLoading />
            </div>
          )}
          {!isProductLoading && products.length !== 0 && (
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
                {products.map(
                  (item, index) =>
                    index <= 6 && (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50"
                        } hover:bg-slate-200 cursor-pointer border-b`}
                        onClick={() => {
                          setOpenProduct(true);
                          setSingleProduct(item);
                        }}
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
                            ₹ {item.mrp}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs border p-1 px-2 rounded-lg">
                            ₹ {item.offerPrice}
                          </span>
                        </td>
                      </tr>
                    ),
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
                {products.map(
                  (item, index) =>
                    index <= 6 && (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-slate-50" : "bg-white"
                        } hover:bg-slate-200 cursor-pointer border-y`}
                        onClick={() => setOpenProduct(true)}
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
                            ₹ {item.mrp}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className="text-xs border p-1 px-2 rounded-lg">
                            ₹ {item.offerPrice}
                          </span>
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>
          )}
          {hadError && products.length === 0 && !isProductLoading && (
            <div className="w-full h-[70vh] flex items-center justify-center text-center">
              Sorry, Something Went Wrong... );{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Products;
