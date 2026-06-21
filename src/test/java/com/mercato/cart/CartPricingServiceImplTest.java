package com.mercato.cart;

import com.mercato.Entity.Product;
import com.mercato.Entity.cart.Cart;
import com.mercato.Entity.cart.CartItem;
import com.mercato.Entity.cart.ChargeType;
import com.mercato.Service.CartPricingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CartPricingServiceImplTest {

    private final CartPricingServiceImpl pricingService = new CartPricingServiceImpl();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(pricingService, "CART_SHIPPING_THRESHOLD", BigDecimal.valueOf(500));
        ReflectionTestUtils.setField(pricingService, "CART_SHIPPING_CHARGE", BigDecimal.valueOf(50));
        ReflectionTestUtils.setField(pricingService, "CART_PLATFORM_FEE", BigDecimal.valueOf(12));
        ReflectionTestUtils.setField(pricingService, "TAX_RATE_PERCENT", BigDecimal.valueOf(18));
    }

    @Test
    void applyCharges_addsTaxAsPercentOfSubtotal() {
        Cart cart = cartWithSubtotal(BigDecimal.valueOf(1000));

        pricingService.applyCharges(cart);

        assertEquals(
                BigDecimal.valueOf(180.00).setScale(2),
                cart.getChargeAmount(ChargeType.TAX)
        );
        assertTrue(cart.findCharge(ChargeType.TAX).get().getDescription().contains("18%"));
    }

    @Test
    void applyCharges_roundsTaxToTwoDecimalPlaces() {
        Cart cart = cartWithSubtotal(new BigDecimal("99.99"));

        pricingService.applyCharges(cart);

        assertEquals(new BigDecimal("18.00"), cart.getChargeAmount(ChargeType.TAX));
    }

    @Test
    void applyCharges_clearsTaxWhenSubtotalIsZero() {
        Cart cart = new Cart();
        cart.addOrUpdateCharge(ChargeType.TAX, BigDecimal.TEN, "Estimated Tax");

        pricingService.applyCharges(cart);

        assertTrue(cart.findCharge(ChargeType.TAX).isEmpty());
    }

    @Test
    void applyCharges_skipsTaxWhenRateIsZero() {
        ReflectionTestUtils.setField(pricingService, "TAX_RATE_PERCENT", BigDecimal.ZERO);
        Cart cart = cartWithSubtotal(BigDecimal.valueOf(500));

        pricingService.applyCharges(cart);

        assertTrue(cart.findCharge(ChargeType.TAX).isEmpty());
    }

    private Cart cartWithSubtotal(BigDecimal unitPrice) {
        Product product = Product.builder()
                .productId("P-1")
                .sellingPrice(unitPrice)
                .build();

        CartItem item = CartItem.builder()
                .product(product)
                .quantity(1)
                .build();

        Cart cart = new Cart();
        cart.setCartItems(List.of(item));
        return cart;
    }
}
