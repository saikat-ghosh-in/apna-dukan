import api from "../../backend/api";
import toast from "react-hot-toast";

export const placeOrder = (orderPayload) => async (dispatch) => {
    try {
        const { data } = await api.post("/orders/capture", orderPayload);
        dispatch({ type: "SET_ORDER_RESPONSE", payload: data });
        return data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to place order");
        throw error;
    }
};
