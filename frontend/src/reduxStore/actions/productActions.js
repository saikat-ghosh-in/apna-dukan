import api from "../../backend/api";
import toast from "react-hot-toast";

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.error(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
        });
    }
};

export const setProductToDisplay = (productId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/public/products/${productId}`);
        dispatch({ type: "SET_PRODUCT_TO_DISPLAY", payload: data });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const clearProductToDisplay = () => ({
    type: "SET_PRODUCT_TO_DISPLAY",
    payload: null,
});
