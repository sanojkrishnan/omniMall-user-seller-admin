import { Filter } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../redux/slice/productSlice";
import { useEffect } from "react";
import ProductCard from "../../components/ui/ProductCard";
import CartLoading from "../../components/ui/CartLoading";

function Shop() {
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(fetchAllProducts({ page: 1, limit: 15 }));
  }, [dispatch]);

  return (
    <div>
      {/* this div is to fill the space of header  */}
      <div className="w-full h-24 "></div>
      <h1 className="text-center text-3xl font-semibold mt-8">
        Shop In Your Choice
      </h1>
      <div className="flex items-center m-4 mb-10 mt-6 border-b-[0.5px] pb-10">
        <SearchBar className={"border-black"} />
        <Button className={"w-fit px-6 m-0 ml-4"}>
          <Filter className="size-4 " /> Filter
        </Button>
      </div>
      <div>
        {isProductLoading && !productError && (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <CartLoading />
          </div>
        )}
        {!isProductLoading && products.length !== 0 && !productError && (
          <div className="px-8 pb-10">
            <ProductCard products={products} />{" "}
          </div>
        )}
        {!isProductLoading && products.length === 0 && productError && (
         <div className="w-full h-[60vh] flex justify-center items-center">
            <h1></h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
