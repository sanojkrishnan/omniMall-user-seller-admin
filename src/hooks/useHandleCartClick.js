import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchLoggedUser } from "../redux/slice/authSlice";
import { addCart, fetchCart } from "../redux/slice/cartSlice";

export const useHandleCartClick = () => {
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load the cart from localStorage into Redux once, on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCartClick = (item) => {
    dispatch(fetchLoggedUser());

    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    dispatch(
      addCart({
        productId: item._id,
        userId,
        sellerId: item.sellerId,
      }),
    );
  };

  return handleCartClick;
};
