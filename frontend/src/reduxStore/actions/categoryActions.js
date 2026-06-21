import api from "../../backend/api";

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({ type: "FETCH_CATEGORIES", payload: data });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.error(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Oops! Something went wrong!",
        });
    }
};
