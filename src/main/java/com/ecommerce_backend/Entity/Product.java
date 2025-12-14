package com.ecommerce_backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@Entity
@Table(name="ecomm_product_snapshot")
public class Product {

    @Id
    private String productId;
    private String gtin;
    private String name;
    private Double unitPrice;
    private Double markDown;
    private String updateUser;
    private String updateDate;

    // add many to one relation with Category
}
