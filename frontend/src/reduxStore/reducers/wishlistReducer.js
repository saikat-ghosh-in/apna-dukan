const initialState = {
    productIds: [],
    loaded: false,
};

export const wishlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_WISHLIST_IDS":
            return { productIds: action.payload, loaded: true };
        case "ADD_WISHLIST_ID":
            return state.productIds.includes(action.payload)
                ? state
                : { ...state, productIds: [...state.productIds, action.payload], loaded: true };
        case "REMOVE_WISHLIST_ID":
            return {
                ...state,
                productIds: state.productIds.filter((id) => id !== action.payload),
                loaded: true,
            };
        case "CLEAR_WISHLIST":
            return { productIds: [], loaded: false };
        default:
            return state;
    }
};
