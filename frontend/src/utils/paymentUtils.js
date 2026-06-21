import api from "../backend/api";
import toast from "react-hot-toast";
import { setPaymentData } from "../reduxStore/actions/paymentActions";

export const syncPayment = async ({ orderId, onSuccess, setLoading }) => {
  setLoading(true);
  try {
    await api.post(`/orders/${orderId}/sync-payment-refund`);
    toast.success("Payment status synced");
    onSuccess?.();
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to sync payment");
  } finally {
    setLoading(false);
  }
};

export const retryPayment = async ({ order, dispatch, navigate, setLoading }) => {
  setLoading(true);
  try {
    const { data } = await api.post(`/orders/${order.orderId}/retry-payment`);
    dispatch(
      setPaymentData({
        paymentSessionId: data.paymentSessionId,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
      })
    );
    navigate("/checkout/cashfree-payment");
  } catch (err) {
    const data = err?.response?.data;
    const message = data?.productId
      ? `Stock is no longer held for this order (${data.availableQty} available). Add items to your cart and try again.`
      : data?.message || "Failed to retry payment. Please try again.";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};