import api from "../../backend/api";
import toast from "react-hot-toast";

export const fetchWishlistIds = () => async (dispatch) => {
    try {
        const { data } = await api.get("/wishlist/ids");
        dispatch({ type: "SET_WISHLIST_IDS", payload: Array.from(data) });
    } catch {
        dispatch({ type: "CLEAR_WISHLIST" });
    }
};

export const toggleWishlist = (productId) => async (dispatch, getState) => {
    const isWishlisted = getState().wishlist.productIds.includes(productId);
    try {
        if (isWishlisted) {
            await api.delete(`/wishlist/${productId}`);
            dispatch({ type: "REMOVE_WISHLIST_ID", payload: productId });
            toast.success("Removed from wishlist");
        } else {
            await api.post(`/wishlist/${productId}`);
            dispatch({ type: "ADD_WISHLIST_ID", payload: productId });
            toast.success("Saved to wishlist");
        }
    } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to update wishlist");
    }
};

export const clearWishlist = () => ({ type: "CLEAR_WISHLIST" });
