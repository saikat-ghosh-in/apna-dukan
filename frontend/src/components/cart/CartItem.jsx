import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiOutlineTrash } from "react-icons/hi";
import { updateCartItemQuantity, removeFromCart } from "../../reduxStore/actions/cartActions";
import { formatCurrency } from "../../utils/formatCurrency";
import { selectCartItemByProductId } from "../../reduxStore/selectors/cartSelectors";
import QuantityStepper from "../shared/QuantityStepper";

const CartItemPresentation = ({ productId, quantity, product, lineTotal, canAddMore, isUpdating, onIncrease, onDecrease, onRemove, onNavigate }) => {
  const hasDiscount = product?.discountPercent > 0;
  const saving = hasDiscount ? (product.retailPrice - product.sellingPrice) * quantity : 0;

  const RemoveBtn = () => (
    <button
      onClick={(e) => { e.stopPropagation(); onRemove(); }}
      disabled={isUpdating}
      className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 bg-gray-100 px-1.5 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <HiOutlineTrash size={12} /> Remove
    </button>
  );

  const ProductImage = ({ size = "16" }) => (
    <div
      onClick={onNavigate}
      className={`w-${size} h-${size} rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 cursor-pointer hover:opacity-80 transition-opacity`}
    >
      {product?.primaryImageUrl ? (
        <img src={product.primaryImageUrl} alt={product.productName} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-200 text-2xl select-none">◈</div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-4 items-center px-5 py-4">

        {/* Col 1–2: Product info + unit price + remove */}
        <div className="col-span-2 flex items-center gap-3">
          <ProductImage size="16" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 mt-1">
              <p
                onClick={onNavigate}
                className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug cursor-pointer hover:text-blue-500 transition-colors"
              >
                {product?.productName || "Item"}
              </p>
              {product?.categoryName && (
                <span className="text-[11px] text-gray-400 font-medium">{product.categoryName}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-semibold text-gray-700">{formatCurrency(product?.sellingPrice)}</span>
              <RemoveBtn />
            </div>
          </div>
        </div>

        {/* Col 3: Quantity stepper */}
        <div className="flex items-center justify-center">
          <QuantityStepper
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            canAddMore={canAddMore}
            pendingSync={isUpdating}
          />
        </div>

        {/* Col 4: Line total + saving */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-900 -mb-0.5">{formatCurrency(lineTotal)}</span>
          {hasDiscount && (
            <span className="text-[11px] font-semibold text-green-500">Save {formatCurrency(saving)}</span>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-2 py-2 space-y-1">
        <div className="flex items-center gap-2">
          <ProductImage size="14" />

          <div className="min-w-0 flex-1 flex flex-col justify-center py-0.5 leading-tight">
            <div className="flex items-center gap-1 leading-none">
              <p
                onClick={onNavigate}
                className="text-sm font-semibold text-gray-900 line-clamp-2 leading-none m-0 cursor-pointer hover:text-blue-500 transition-colors"
              >
                {product?.productName || "Item"}
              </p>
              {product?.categoryName && (
                <span className="text-[11px] text-gray-400 font-medium shrink basis-0 overflow-hidden leading-none">{product.categoryName}</span>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none">
              <span className="text-[11px] font-semibold text-gray-700 leading-none">{formatCurrency(product?.sellingPrice)}</span>
              <RemoveBtn />
            </div>
          </div>

          <div className="flex items-center justify-center shrink-0">
            <QuantityStepper
              quantity={quantity}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              canAddMore={canAddMore}
              pendingSync={isUpdating}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total</span>
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-gray-900 -mb-0.5">{formatCurrency(lineTotal)}</span>
            {hasDiscount && (
              <span className="text-[11px] font-semibold text-green-500">Saving {formatCurrency(saving)}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Memoized presentation component
const MemoizedCartItemPresentation = React.memo(
  CartItemPresentation,
  (prevProps, nextProps) => {
    return (
      prevProps.productId === nextProps.productId &&
      prevProps.quantity === nextProps.quantity &&
      prevProps.lineTotal === nextProps.lineTotal &&
      prevProps.canAddMore === nextProps.canAddMore &&
      prevProps.isUpdating === nextProps.isUpdating &&
      prevProps.product?.productId === nextProps.product?.productId &&
      prevProps.product?.primaryImageUrl === nextProps.product?.primaryImageUrl &&
      prevProps.product?.productName === nextProps.product?.productName &&
      prevProps.product?.sellingPrice === nextProps.product?.sellingPrice &&
      prevProps.product?.retailPrice === nextProps.product?.retailPrice &&
      prevProps.product?.discountPercent === nextProps.product?.discountPercent &&
      prevProps.product?.categoryName === nextProps.product?.categoryName
    );
  }
);

// Container component that selects its own data from Redux
const CartItem = ({ productId, product, cartItemData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItem = useSelector(selectCartItemByProductId(productId));
  const updateSeq = useSelector((state) => state.cart.updateSeq);
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset isUpdating when cartItem updates (after Redux sync completes)
  useEffect(() => {
    setIsUpdating(false);
  }, [cartItem?.quantity, cartItem?.lineTotal, updateSeq]);

  if (!cartItem) return null;

  const handleIncrease = () => {
    setIsUpdating(true);
    dispatch(updateCartItemQuantity(productId, cartItem.quantity + 1));
  };

  const handleDecrease = () => {
    setIsUpdating(true);
    if (cartItem.quantity <= 1) {
      dispatch(removeFromCart(productId));
      return;
    }
    dispatch(updateCartItemQuantity(productId, cartItem.quantity - 1));
  };

  const handleRemove = () => {
    setIsUpdating(true);
    dispatch(removeFromCart(productId));
  };
  const handleNavigate = () => navigate(`/products/${productId}`);

  return (
    <MemoizedCartItemPresentation
      productId={productId}
      quantity={cartItem.quantity}
      product={product}
      lineTotal={cartItem.lineTotal}
      canAddMore={cartItem.canAddMore}
      isUpdating={isUpdating}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove}
      onNavigate={handleNavigate}
    />
  );
};

export default React.memo(CartItem);