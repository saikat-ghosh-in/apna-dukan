import api from "../../backend/api";

export const fetchSellers = () => async (dispatch) => {
    try {
        const { data } = await api.get("/public/sellers");
        dispatch({ type: "FETCH_SELLERS", payload: Array.isArray(data) ? data : [] });
    } catch (error) {
        console.error(error);
    }
};
