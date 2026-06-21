import api from "../../backend/api";

export const fetchSellers = () => async (dispatch) => {
    try {
        const { data } = await api.get("/public/sellers");
        dispatch({ type: "FETCH_SELLERS", payload: data ?? [] });
    } catch (error) {
        console.error(error);
    }
};
