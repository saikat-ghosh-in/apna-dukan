export const setPaymentData = (paymentData) => ({
    type: "SET_PAYMENT_DATA",
    payload: paymentData,
});

export const clearPaymentData = () => ({
    type: "CLEAR_PAYMENT_DATA",
});

export const updatePaymentStatus = (status) => ({
    type: "UPDATE_PAYMENT_STATUS",
    payload: status,
});
