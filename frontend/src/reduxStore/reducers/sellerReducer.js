const initialState = {
    sellers: [],
    totalSellers: 0,
};

export const sellerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_SELLERS":
            return {
                sellers: action.payload,
                totalSellers: action.payload.length,
            };
        default:
            return state;
    }
};