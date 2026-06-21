import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdCategory, MdShoppingCart } from "react-icons/md";
import { FiMinus, FiPlus } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { addToCart, updateCartItemQuantity, removeFromCart } from "../../reduxStore/actions/cartActions";
import { formatCurrency } from "../../utils/formatCurrency";
import { selectCartItemByProductId } from "../../reduxStore/selectors/cartSelectors";

const LOW_STOCK_THRESHOLD = 5;

const ProductCard = ({ product, onClick }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const cartItem = useSelector(selectCartItemByProductId(product.productId));

    const { availableQty: qty } = product;
    const hasDiscount = product.discountPercent > 0;

    const cartQty = cartItem?.quantity ?? 0;
    const inCart = cartQty > 0;
    
    // availableQty from backend ALREADY INCLUDES user's cart reservation
    const canAddMore = product.availableQty ?? 0;

    const inStock = qty > 0 || (inCart && !cartItem?.outOfStock);
    const lowStock = canAddMore > 0 && canAddMore <= LOW_STOCK_THRESHOLD;

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        setLoading(true);
        await dispatch(addToCart(product.productId, 1, product.sellingPrice));
        setLoading(false);
    };

    const handleIncrease = async (e) => {
        e.stopPropagation();
        dispatch(updateCartItemQuantity(product.productId, cartQty + 1));
    };

    const handleDecrease = async (e) => {
        e.stopPropagation();
        if (cartQty <= 1) {
            dispatch(removeFromCart(product.productId));
        } else {
            dispatch(updateCartItemQuantity(product.productId, cartQty - 1));
        }
    };

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden 
            hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
        >
            <div className="relative aspect-square bg-gray-50 overflow-hidden shrink-0">
                {product.primaryImageUrl ? (
                    <img
                        src={product.primaryImageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl select-none">◈</div>
                )}

                {lowStock && inStock && (
                    <div className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Only {qty} left
                    </div>
                )}

                {!inStock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                            Out of Stock
                        </span>
                    </div>
                )}

                {hasDiscount && product.discountPercent >= 10 && (
                    <div className="absolute -bottom-3 left-3 z-10 flex items-baseline gap-0.5 bg-blue-500 text-white 
                    pl-2.5 pr-3 pt-1 pb-3.5 rounded-full shadow-md">
                        <span className="text-sm font-black leading-none">{product.discountPercent}</span>
                        <span className="text-[10px] font-bold leading-none">% OFF</span>
                    </div>
                )}
            </div>

            <div className="p-3.5 flex flex-col flex-1">
                <p className="text-[11px] font-semibold text-blue-500 mb-1 flex items-center gap-1">
                    <MdCategory size={10} /> {product.categoryName}
                </p>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug h-10">
                    {product.productName}
                </p>
                <div className="flex items-baseline gap-1.5 mt-2 flex-wrap">
                    <span className="text-base font-black text-gray-950">{formatCurrency(product.sellingPrice)}</span>
                    {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">{formatCurrency(product.retailPrice)}</span>
                    )}
                </div>

                <div className="mt-auto pt-3" onClick={e => e.stopPropagation()}>
                    {inCart ? (
                        <div className="flex items-center justify-between border border-blue-100 bg-blue-50 rounded-xl overflow-hidden h-9">
                            <button
                                onClick={handleDecrease}
                                className="w-15 h-9 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors 
                                cursor-pointer shrink-0"
                            >
                                {cartQty === 1 ? <HiOutlineTrash size={14} /> : <FiMinus size={14} />}
                            </button>
                            <span className="text-sm font-bold text-blue-500">{cartQty}</span>
                            <button
                                onClick={handleIncrease}
                                className="w-15 h-9 flex items-center justify-center text-blue-400 hover:bg-blue-100
                                transition-colors cursor-pointer shrink-0"
                            >
                                <FiPlus size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={!inStock || loading}
                            className="w-full h-9 flex items-center justify-center gap-1.5 bg-gray-950 hover:bg-gray-800 
                            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs 
                            font-bold rounded-xl transition-all cursor-pointer"
                        >
                            <MdShoppingCart size={14} />
                            {loading ? "Adding..." : !inStock ? "Out of Stock" : "Add to Cart"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const CardSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-100" />
        <div className="p-3.5 space-y-2">
            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            <div className="h-3.5 bg-gray-100 rounded w-full" />
            <div className="h-3.5 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mt-3" />
            <div className="h-8 bg-gray-100 rounded w-full mt-1" />
        </div>
    </div>
);

export default ProductCard;