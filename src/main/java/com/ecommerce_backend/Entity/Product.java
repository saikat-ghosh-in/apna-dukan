package com.ecommerce_backend.Entity;

import lombok.*;

@Data
@Builder
public class Product {
    private String productId;
    private String gtin;
    private String description;
    private String productCategory;
    private Double unitPrice;
    private String updateUser;
    private String updateDate;
}
