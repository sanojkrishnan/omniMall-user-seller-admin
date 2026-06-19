import { Edit, Trash, X } from "lucide-react";
import { FormCard } from "./ui/FormCard";
import { Button } from "./ui/Button";

function SingleProductList(props) {
  const { openProduct, setOpenProduct, product, setProduct } = props;
  return (
    <FormCard className={"p-2"}>
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
            class="rounded-t-base object-cover h-56 w-full"
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
