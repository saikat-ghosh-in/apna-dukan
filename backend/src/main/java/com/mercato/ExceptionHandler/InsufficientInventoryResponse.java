package com.mercato.ExceptionHandler;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsufficientInventoryResponse {
    private String message;
    private boolean error;
    private String productId;
    private int availableQty;
}
