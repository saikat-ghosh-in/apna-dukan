import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { clearPaymentData } from "../../reduxStore/actions/paymentActions";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }
    // Cashfree doesn't pass payment status in return URL
    // actual status is confirmed via webhook on backend
    // we show a pending/success UI and direct user to orders
    dispatch(clearPaymentData());
    setStatus("success");
  }, [orderId, dispatch]);

  if (status === "loading") {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-gray-500 text-sm">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-gray-50 min-h-screen py-6 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-2xl">
                <FaTimesCircle size={40} className="text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't confirm your payment. Please try again from checkout.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all"
              >
                Return to Checkout
              </button>
              {orderId && (
                <button
                  onClick={() => navigate(`/orders?orderId=${orderId}`)}
                  className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded-xl transition-colors"
                >
                  Check Order Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-50 rounded-2xl">
              <FaCheckCircle size={40} className="text-green-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Submitted!</h2>
          <p className="text-sm text-gray-500 mb-2">
            Your payment is being processed. We'll update your order status shortly.
          </p>

          {/* Pending notice */}
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl mb-6">
            <FaClock className="text-yellow-500 shrink-0" />
            <p className="text-xs text-yellow-700 text-left">
              Payment confirmation may take a few seconds. Check your order for the latest status.
            </p>
          </div>

          {orderId && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Order</span>
                <span className="font-semibold text-gray-800">#{orderId}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(orderId ? `/orders?orderId=${orderId}` : "/orders")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all"
            >
              <MdShoppingBag size={16} /> View Order
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;