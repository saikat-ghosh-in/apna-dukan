const initialState = {
    products: [],
    pagination: {},
    productToDisplay: null
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };
        case "SET_PRODUCT_TO_DISPLAY":
            return {
                ...state,
                productToDisplay: action.payload
            };
        default:
            return state;
    }
};