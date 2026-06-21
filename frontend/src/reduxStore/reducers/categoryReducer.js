const initialState = {
    totalCategories: 0,
    categories: []
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_CATEGORIES":
            return {
                categories: action.payload,
                totalCategories: action.payload.length
            };
        default:
            return state;
    }
};