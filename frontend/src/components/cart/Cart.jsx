import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import api from "../../backend/api";
import { formatCurrency } from "../../utils/formatCurrency";
import {
    selectCartItems,
    selectCartQty,
    selectCharges,
    selectSubtotal,
    selectTotal,
    selectCartPendingSync,
    selectCartLoading,
    selectCartError,
    selectIsCartEmpty
} from "../../reduxStore/selectors/cartSelectors";

const Cart = () => {
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartQty = useSelector(selectCartQty);
    const isCartEmpty = useSelector(selectIsCartEmpty);
    const subtotal = useSelector(selectSubtotal);
    const total = useSelector(selectTotal);
    const { shipping, platformFee, processingAndHandling, tax } = useSelector(selectCharges);
    const pendingSync = useSelector(selectCartPendingSync);
    const cartLoading = useSelector(selectCartLoading);
    const cartError = useSelector(selectCartError);

    const [cartWithProducts, setCartWithProducts] = useState([]);
    const previousCartItemsRef = useRef(null);

    useEffect(() => {
        if (cartItems.length === 0) {
            setCartWithProducts([]);
            previousCartItemsRef.current = null;
            return;
        }

        // Only fetch if cart items have actually changed (not just re-render)
        const cartItemIds = cartItems.map(item => item.productId).join(',');
        const previousItemIds = previousCartItemsRef.current?.itemIds;

        if (cartItemIds === previousItemIds) {
            // Items haven't changed, just update quantities
            setCartWithProducts(prev =>
                prev.map(item => {
                    const updatedItem = cartItems.find(ci => ci.productId === item.productId);
                    return updatedItem ? { ...item, ...updatedItem } : item;
                })
            );
            return;
        }

        // Fetch new products
        const fetchProducts = async () => {
            try {
                const productIds = cartItems.map(item => item.productId);
                const products = await Promise.all(
                    productIds.map(id =>
                        api.get(`/public/products/${id}`)
                            .then(res => res.data)
                            .catch(() => null)
                    )
                );

                const productMap = {};
                products.forEach(p => {
                    if (p) productMap[p.productId] = p;
                });

                const enriched = cartItems.map(item => ({
                    ...item,
                    product: productMap[item.productId] || null
                }));

                setCartWithProducts(enriched);
                previousCartItemsRef.current = { itemIds: cartItemIds };
            } catch (error) {
                console.error("Failed to fetch product details:", error);
                setCartWithProducts(cartItems);
            }
        };

        fetchProducts();
    }, [cartItems]);

    if (isCartEmpty && !cartLoading) return <EmptyCart />;

    const freeShippingAbove = import.meta.env.VITE_FREE_SHIPPING_ABOVE;

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <MdShoppingCart size={20} className="text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {cartQty} item{cartQty !== 1 ? "s" : ""} in your cart
                        </p>
                    </div>
                </div>

                {/* Error Banner */}
                {cartError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <span className="text-red-600 text-sm font-semibold">⚠️ Error loading cart</span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">{cartError}</p>
                    </div>
                )}

                {/* Loading Skeleton */}
                {cartLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="hidden md:grid grid-cols-4 gap-4 px-5 py-3 border-b border-gray-100">
                                <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Product</div>
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">Quantity</div>
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center">Total</div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {cartWithProducts.map((item) => (
                                    <CartItem
                                      key={item.productId}
                                      productId={item.productId}
                                      product={item.product}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
                                {pendingSync && (
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                                        Updating...
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <SummaryRow label={`Subtotal (${cartQty} items)`} value={formatCurrency(subtotal)} />
                                <div>
                                    <SummaryRow
                                        label="Shipping"
                                        value={
                                            shipping === 0
                                                ? <span className="font-semibold text-green-600">FREE</span>
                                                : formatCurrency(shipping)
                                        }
                                    />
                                    {shipping > 0 && (
                                        <p className="text-xs text-green-600 mt-1 text-right">
                                            Free over {formatCurrency(freeShippingAbove)}
                                        </p>
                                    )}
                                </div>
                                <SummaryRow label="Platform Fee" value={formatCurrency(platformFee)} />
                                <SummaryRow label="Processing & Handling" value={formatCurrency(processingAndHandling)} />
                                {tax > 0 && (
                                    <SummaryRow label="Estimated Tax" value={formatCurrency(tax)} />
                                )}
                            </div>

                            <div className="flex justify-between items-center py-4">
                                <span className="text-sm font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-black text-gray-950">{formatCurrency(total)}</span>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                disabled={cartError || cartQty === 0}
                                className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-150 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                <MdShoppingCart size={16} />
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate("/products")}
                                className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition-colors"
                            >
                                <MdArrowBack size={15} />
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SummaryRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-800">{value}</span>
    </div>
);

export default Cart;