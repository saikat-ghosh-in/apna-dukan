package com.ecommerce_backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@Entity
@Table(name="ecomm_category_snapshot")
public class Category {

    @Id
    private String categoryId;
    private String name;
//    private List<Product> products;
}
