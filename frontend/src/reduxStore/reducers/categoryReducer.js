const initialState = {
    totalCategories: 0,
    categories: []
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_CATEGORIES": {
            const categories = Array.isArray(action.payload) ? action.payload : [];
            return {
                categories,
                totalCategories: categories.length
            };
        }
        default:
            return state;
    }
};