const initialState = {
    sellers: [],
    totalSellers: 0,
};

export const sellerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_SELLERS": {
            const sellers = Array.isArray(action.payload) ? action.payload : [];
            return {
                sellers,
                totalSellers: sellers.length,
            };
        }
        default:
            return state;
    }
};