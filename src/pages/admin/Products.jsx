import { AlertTriangle, Filter, Plus, TriangleAlert } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductError,
  fetchAllProducts,
} from "../../redux/slice/productSlice";
import {
  fetchAllSellers,
  clearError as clearSellerError,
} from "../../redux/slice/sellerSlice";
import {
  fetchAllCategories,
  clearError as clearCategoryError,
} from "../../redux/slice/categorySlice";
import CartLoading from "../../components/ui/CartLoading";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import ProductListTile from "../../components/ProductListTile";
import Loading from "../../components/ui/Loading";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";

function Products() {
  const dispatch = useDispatch();

  //product fetch
  const {
    products = [],
    isProductLoading,
    productError,
    totalPages,
    hasNextPage,
  } = useSelector((state) => state.product);

  const { seller, isSellerLoading, sellerError } = useSelector(
    (state) => state.seller,
  );
  const { category, isCategoryLoading, categoryError } = useSelector(
    (state) => state.category,
  );

  console.log("PRODUCT LIST :", productError);

  const [openProduct, setOpenProduct] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  const [hadError, setHadError] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllProducts({ page, limit: 15 }));
  }, [dispatch, page]);

  const lastFetchedIdsRef = useRef("");

  // infinite scrolling
  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: isProductLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  //seller and category fetch using ids in products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueSellerIds = [
        ...new Set(
          products
            .map((item) =>
              typeof item.sellerId === "object"
                ? item.sellerId._id
                : item.sellerId,
            )
            .filter(Boolean),
        ),
      ];
      const uniqueCategoryIds = [
        ...new Set(
          products
            .map((item) =>
              typeof item.categoryId === "object"
                ? item.categoryId._id
                : item.categoryId,
            )
            .filter(Boolean),
        ),
      ];

      const idsKey = uniqueSellerIds.sort().join(",");

      const idcKey = uniqueCategoryIds.sort().join(",");

      if (uniqueSellerIds.length > 0 && idsKey !== lastFetchedIdsRef.current) {
        lastFetchedIdsRef.current = idsKey;
        dispatch(
          fetchAllSellers({
            pagination: { page: 1, limit: uniqueSellerIds.length },
            uniqueSellers: uniqueSellerIds,
          }),
        );
      }
      if (
        uniqueCategoryIds.length > 0 &&
        idcKey !== lastFetchedIdsRef.current
      ) {
        lastFetchedIdsRef.current = idcKey;
        dispatch(
          fetchAllCategories({
            pagination: { page: 1, limit: uniqueCategoryIds.length },
            uniqueCategories: uniqueCategoryIds,
          }),
        );
      }
    }
  }, [products, dispatch]);
  // sellerId - seller, O(1) lookup instead of .find() inside the row loop
  const sellerMap = useMemo(() => {
    const map = {};
    (seller || []).forEach((item) => {
      map[item._id] = item;
    });
    return map;
  }, [seller]);

  const categoryMap = useMemo(() => {
    const map = {};
    (category || []).forEach((item) => {
      map[item._id] = item;
    });
    return map;
  }, [category]);

  // Top Selling stays fixed at the first 7 products ever fetched.
  // Locked via ref so it doesn't keep shifting as more pages load
  // through infinite scroll. "All Products" below still shows every
  // product, including these same 7 — no exclusion needed there.
  const topSellingRef = useRef(null);
  if (!topSellingRef.current && products.length >= 7) {
    topSellingRef.current = products.slice(0, 7);
  }
  const topSellingProducts = topSellingRef.current ?? products.slice(0, 7);

  useEffect(() => {
    if (productError) {
      toast.error(productError);
      setHadError(true);
      dispatch(clearProductError());
    }
    if (sellerError) {
      toast.error(sellerError);
      dispatch(clearSellerError());
    }
  }, [productError, sellerError, dispatch]);

  const getSellerName = (sellerId) => {
    const s = sellerMap[sellerId];
    return s ? `${s.firstName} ${s.lastName}` : "Unknown Seller";
  };

  return (
    <>
      <div className="flex items-center">
        <div
          className={`${openProduct || addProduct ? "scale-100" : "scale-0"} transition-all duration-500 fixed inset-0 z-50 flex items-center justify-center`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setOpenProduct(false);
              setAddProduct(false);
            }
          }}
        >
          <ProductListTile
            setOpenProduct={setOpenProduct}
            product={singleProduct}
            addProduct={addProduct}
            setAddProduct={setAddProduct}
            openProduct={openProduct}
          />
        </div>
        <div className="w-full">
          <SearchBar colorVariants="admin" />
        </div>
      </div>
      <div className="flex justify-start">
        <Button
          className={"bg-[#5f0000] w-fit px-4"}
          onClick={() => {
            setAddProduct(true);
            setOpenProduct(false);
          }}
        >
          <Plus /> Add Products
        </Button>
      </div>
      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
        <div className="w-full flex-1 overflow-y-auto px-4 pb-4 custom-scrollBar">
          {isProductLoading && !productError && products.length === 0 && (
            <div className="w-full h-[65vh] flex items-center justify-center">
              <CartLoading />
            </div>
          )}

          {!isProductLoading && products.length !== 0 && (
            <>
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
                  {topSellingProducts.map((item, index) => (
                    <tr
                      key={item._id ?? index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      } hover:bg-slate-200 cursor-pointer border-b`}
                      onClick={() => {
                        setOpenProduct(true);
                        setAddProduct(false);
                        setSingleProduct({
                          ...item,
                          sellerData: sellerMap[item.sellerId] ?? null,
                          categoryData: categoryMap[item.categoryId] ?? null,
                        });
                      }}
                    >
                      <td className="p-3">
                        {item.productImage?.length > 0 ? (
                          <div className="w-12 h-12 overflow-hidden rounded-md">
                            <img
                              className="w-full h-full object-cover"
                              src={item.productImage?.[0]?.url}
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
                        <div className="text-xs text-gray-500">
                          {isCategoryLoading ? (
                            <div className="w-6 h-6">
                              <Loading
                                variant="secondary"
                                className="size-3 border-2 border-gray-500"
                              />
                            </div>
                          ) : categoryError ? (
                            ""
                          ) : (
                            (categoryMap[item.categoryId]?.name ??
                            "Unknown Category")
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-sm">
                        {isSellerLoading ? (
                          <Loading className="size-6 border" />
                        ) : sellerError ? (
                          "Failed to fetch seller"
                        ) : (
                          (() => {
                            const sellerObj = sellerMap[item.sellerId];
                            return (
                              <div className="flex w-fit gap-2 border p-1 pr-2 rounded-full justify-center items-center">
                                <div className="w-8 h-8 rounded-full border flex justify-center items-center text-center">
                                  {sellerObj?.profileImage?.url ? (
                                    <img
                                      className="w-8 h-8 rounded-full object-cover"
                                      src={sellerObj.profileImage.url}
                                      alt={getSellerName(item.sellerId)}
                                    />
                                  ) : (
                                    <AlertTriangle className="size-4" />
                                  )}
                                </div>
                                {getSellerName(item.sellerId)}
                              </div>
                            );
                          })()
                        )}
                      </td>

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
                  ))}
                </tbody>

                <thead>
                  <tr>
                    <th colSpan={6} className="text-lg p-6 border-b">
                      All Products
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((item, index) => (
                    <tr
                      key={`all-${item._id ?? index}`}
                      className={`${
                        index % 2 === 0 ? "bg-slate-50" : "bg-white"
                      } hover:bg-slate-200 cursor-pointer border-y`}
                      onClick={() => {
                        setOpenProduct(true);
                        setSingleProduct(item);
                      }}
                    >
                      <td className="p-3">
                        {item.productImage?.length > 0 ? (
                          <div className="w-12 h-12 overflow-hidden rounded-md">
                            <img
                              className="w-full h-full object-cover"
                              src={item.productImage?.[0]?.url}
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
                        <div className="text-xs text-gray-500">
                          {isCategoryLoading ? (
                            <div className="w-6 h-6">
                              <Loading
                                variant="secondary"
                                className="size-3 border-2 border-gray-500"
                              />
                            </div>
                          ) : categoryError ? (
                            ""
                          ) : (
                            (categoryMap[item.categoryId]?.name ??
                            "Unknown Category")
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-sm">
                        {isSellerLoading ? (
                          <Loading className="size-6 border" />
                        ) : sellerError ? (
                          "Failed to fetch seller"
                        ) : (
                          (() => {
                            const sellerObj = sellerMap[item.sellerId];
                            return (
                              <div className="flex w-fit gap-2 border p-1 pr-2 rounded-full justify-center items-center">
                                <div className="w-8 h-8 rounded-full border flex justify-center items-center text-center">
                                  {sellerObj?.profileImage?.url ? (
                                    <img
                                      className="w-8 h-8 rounded-full object-cover"
                                      src={sellerObj.profileImage.url}
                                      alt={getSellerName(item.sellerId)}
                                    />
                                  ) : (
                                    <AlertTriangle className="size-4" />
                                  )}
                                </div>
                                {getSellerName(item.sellerId)}
                              </div>
                            );
                          })()
                        )}
                      </td>
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
                  ))}
                </tbody>
              </table>
              <div id={triggerId} className="h-10" />
            </>
          )}
          {hadError && products.length === 0 && !isProductLoading && (
            <div className="w-full h-[65vh] flex items-center justify-center text-center">
              Sorry, Something Went Wrong...
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Products;
