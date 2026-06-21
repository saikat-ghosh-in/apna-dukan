import api from "../../backend/api";
import toast from "react-hot-toast";
import { showWarningToast } from "../../utils/toastUtils";

export const syncCartFromBackend = () => async (dispatch) => {
  try {
    const { data } = await api.get(`/cart`);
    dispatch({ type: "SYNC_CART_SUCCESS", payload: data });
  } catch (error) {
    console.error("Failed to sync cart:", error);
    if (error?.response?.status === 404) {
      dispatch({ type: "CLEAR_CART" });
    }
  }
};

export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  dispatch({ type: "CART_PENDING" });
  try {
    const { data } = await api.post(`/cart/add`, { cartItems: [{ productId, quantity }] });
    dispatch({ type: "SYNC_CART_SUCCESS", payload: data });
    toast.success("Added to cart ✓");
  } catch (error) {
    dispatch({ type: "CART_IDLE" });
    const status = error?.response?.status;
    if (status === 409) {
      const availableQty = error?.response?.data?.availableQty;
      toast.error(
        availableQty === 0
          ? "This item is out of stock"
          : `Only ${availableQty} unit${availableQty !== 1 ? "s" : ""} available`
      );
    } else {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    }
  }
};

const _qtyUpdateTimers = {};
const _pendingDeltas = {};

export const updateCartItemQuantity = (productId, newQuantity) => (dispatch, getState) => {
  const currentQty = getState().cart.cartItems.find((i) => i.productId === productId)?.quantity ?? 0;
  if (newQuantity === currentQty) return;

  const clickDelta = newQuantity - currentQty;
  _pendingDeltas[productId] = (_pendingDeltas[productId] ?? 0) + clickDelta;

  if (_qtyUpdateTimers[productId]) clearTimeout(_qtyUpdateTimers[productId]);

  _qtyUpdateTimers[productId] = setTimeout(async () => {
    delete _qtyUpdateTimers[productId];

    const totalDelta = _pendingDeltas[productId] ?? 0;
    delete _pendingDeltas[productId];

    if (totalDelta === 0) return;

    const confirmedQty = getState().cart.cartItems.find((i) => i.productId === productId)?.quantity ?? 0;
    const targetQty = confirmedQty + totalDelta;

    if (targetQty <= 0) {
      dispatch(removeFromCart(productId));
      return;
    }

    try {
      const { data } = await api.put(`/cart`, { productId, quantity: targetQty });
      dispatch({ type: "SYNC_CART_SUCCESS", payload: data });
      if (data.warning) showWarningToast(data.warning);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update quantity");
      dispatch({ type: "CART_ITEM_UPDATE_FAILED", payload: productId });
    }
  }, 500);
};

export const removeFromCart = (productId) => async (dispatch) => {
  dispatch({ type: "CART_PENDING" });
  try {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    dispatch({ type: "SYNC_CART_SUCCESS", payload: data });
    toast.success("Removed from cart ✓");
  } catch (error) {
    dispatch({ type: "CART_IDLE" });
    toast.error("Couldn't remove item. Please try again.");
  }
};

export const clearCart = () => async (dispatch) => {
  dispatch({ type: "CART_PENDING" });
  try {
    await api.delete(`/cart`);
    dispatch({ type: "CLEAR_CART" });
  } catch (error) {
    dispatch({ type: "CART_IDLE" });
    toast.error("Failed to clear cart. Please try again.");
  }
};
