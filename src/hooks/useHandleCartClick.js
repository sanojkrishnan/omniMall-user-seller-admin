import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchLoggedUser } from "../redux/slice/authSlice";
import { addCart } from "../redux/slice/cartSlice";

export const useHandleCartClick = () => {
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCartClick = async (item) => {
    let currentUserId = userId;

    if (!currentUserId) {
      const result = await dispatch(fetchLoggedUser());
      currentUserId = result.payload?._id;
    }

    if (!currentUserId) {
      navigate("/login", { replace: true });
      return; // no cart action happened — ProductCard should treat this as non-success, which it already does since result stays undefined
    }

    return dispatch(
      addCart({
        data: {
          userId: currentUserId,
          cart: [
            {
              productId: item._id,
              sellerId: item.sellerId,
              qnty: 1,
            },
          ],
        },
      }),
    );
  };

  return handleCartClick;
};