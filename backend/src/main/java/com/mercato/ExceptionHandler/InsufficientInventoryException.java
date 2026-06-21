package com.mercato.ExceptionHandler;

import lombok.Getter;

@Getter
public class InsufficientInventoryException extends RuntimeException {
    private final String productId;
    private final int availableQty;

    public InsufficientInventoryException(String productId, int availableQuantity) {
        super("Insufficient inventory");
        this.productId = productId;
        this.availableQty = availableQuantity;
    }
}