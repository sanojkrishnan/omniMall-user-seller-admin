import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCart } from "../redux/slice/cartSlice";

export const useHandleCartClick = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCartClick = (item) => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    return dispatch(
      addCart({
        data: {
          cart: [{ productId: item._id, sellerId: item.sellerId, qnty: 1 }],
        },
      }),
    );
  };

  return handleCartClick;
};
