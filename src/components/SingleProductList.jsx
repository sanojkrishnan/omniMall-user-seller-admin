import { Edit, Trash, X } from "lucide-react";
import { FormCard } from "./ui/FormCard";
import { Button } from "./ui/Button";
import { useEffect, useRef } from "react";

function SingleProductList(props) {
  const { openProduct, setOpenProduct, product, setProduct } = props;

  const divRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setOpenProduct(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FormCard className={"p-2"} ref={divRef}>
      <div className="w-full flex products-start justify-end mb-1">
        <Button
          variant="secondary"
          className={"w-fit p-1 m-0 rounded-full "}
          onClick={() => setOpenProduct(false)}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div>
        <div className="relative w-full h-fit">
          <img
            class="rounded-t-base object-cover h-60 w-full"
            src={product.productImage}
            alt={product.productName}
          />
          <div className="absolute flex products-end justify-end w-full h-1/2 bottom-0 rounded-b-lg bg-gradient-to-t from-gray-900 to-white/0"></div>
        </div>
        <div className="p-6">
          <div>
            <div className="border-b py-2">
              <h1 className="mt-3 mb-2 text-2xl font-semibold tracking-tight text-heading">
                {product.productName}
              </h1>
              <p>Current Stock :{product.stock}</p>
              <p>{product.productDesc}</p>
              <p>Rating : 15k</p>

              <h5 className="">
                MRP :<span>{product.mrp}$</span>
              </h5>
              <p>13% off</p>
              <h5 className="text-xl">Seller Price :{product.offerPrice}$</h5>
            </div>
            <div>
              <div>
                Category: &nbsp;
                {product.categoryData ? (
                  <a className="text-blue-500" href="">
                    {product.categoryData?.name}
                  </a>
                ) : (
                  "Unknown Category"
                )}
              </div>
              <div>
                Sold by: &nbsp;
                {product.sellerData ? (
                  <a className="text-blue-500" href="">
                    {product.sellerData.firstName} {product.sellerData.lastName}
                  </a>
                ) : (
                  "Unknown Seller"
                )}
              </div>
              {product.sellerData?.profileImage?.url && (
                <img
                  src={product.sellerData.profileImage.url}
                  alt="Seller"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
            <div className="pt-4">
              <Button>
                <Edit /> Edit
              </Button>
              <Button
                variant="secondary"
                className={" text-red-500 border-red-500"}
              >
                <Trash /> Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
}

export default SingleProductList;
