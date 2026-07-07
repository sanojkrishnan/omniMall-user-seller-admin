import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchLoggedUser } from "../redux/slice/authSlice";
import { addCart, fetchCart } from "../redux/slice/cartSlice";

export const useHandleCartClick = () => {
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCartClick = async (item) => {
    let currentUserId = userId;

    if (!currentUserId) {
      const result = await dispatch(fetchLoggedUser());
      currentUserId = result.payload?._id;
    }

    if (!currentUserId) {
      navigate("/login", { replace: true });
      return;
    }

    dispatch(
      addCart({
        productId: item._id,
        userId: currentUserId,
        sellerId: item.sellerId,
      }),
    );
  };

  return handleCartClick;
};
