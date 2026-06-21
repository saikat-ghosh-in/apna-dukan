package com.mercato.inventory;

import com.mercato.Entity.Product;
import com.mercato.ExceptionHandler.InsufficientInventoryException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ProductInventoryTest {

    @Test
    void availableQty_reflectsPhysicalMinusReserved() {
        Product product = Product.builder()
                .productId("P-1")
                .physicalQty(10)
                .reservedQty(3)
                .build();

        assertEquals(7, product.getAvailableQty());
    }

    @Test
    void adjustReservedQty_increasesAndDecreasesWithinPhysicalStock() {
        Product product = Product.builder()
                .productId("P-1")
                .physicalQty(10)
                .reservedQty(2)
                .build();

        product.adjustReservedQty(3);
        assertEquals(5, product.getReservedQty());
        assertEquals(5, product.getAvailableQty());

        product.adjustReservedQty(-2);
        assertEquals(3, product.getReservedQty());
        assertEquals(7, product.getAvailableQty());
    }

    @Test
    void adjustReservedQty_rejectsWhenExceedingPhysicalStock() {
        Product product = Product.builder()
                .productId("P-1")
                .physicalQty(5)
                .reservedQty(4)
                .build();

        assertThrows(InsufficientInventoryException.class, () -> product.adjustReservedQty(2));
    }

    @Test
    void adjustReservedQty_rejectsNegativeReservedTotal() {
        Product product = Product.builder()
                .productId("P-1")
                .physicalQty(10)
                .reservedQty(1)
                .build();

        assertThrows(IllegalStateException.class, () -> product.adjustReservedQty(-2));
    }
}
