package com.mercato.Mapper;

import com.mercato.Entity.Product;
import com.mercato.Payloads.Request.ProductRequestDTO;
import com.mercato.Payloads.Response.ProductResponseDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequestDTO dto) {
        return Product.builder()
                .productName(dto.getProductName())
                .description(dto.getDescription())
                .retailPrice(dto.getRetailPrice())
                .discountPercent(dto.getDiscountPercent())
                .primaryImageUrl(dto.getPrimaryImageUrl())
                .secondaryImageUrls(dto.getSecondaryImageUrls() != null
                        ? new ArrayList<>(dto.getSecondaryImageUrls())
                        : new ArrayList<>())
                .physicalQty(dto.getPhysicalQty())
                .reservedQty(0)
                .active(dto.isActive())
                .build();
    }

    public ProductResponseDTO toDTO(Product product) {
        ProductResponseDTO dto = ProductResponseDTO.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .retailPrice(product.getRetailPrice())
                .discountPercent(product.getDiscountPercent())
                .sellingPrice(product.getSellingPrice())
                .primaryImageUrl(product.getPrimaryImageUrl())
                .secondaryImageUrls(product.getSecondaryImageUrls() != null
                        ? new ArrayList<>(product.getSecondaryImageUrls())
                        : new ArrayList<>())
                .allImages(product.getAllImages())
                .physicalQty(product.getPhysicalQty())
                .reservedQty(product.getReservedQty())
                .availableQty(product.getAvailableQty())
                .active(product.isActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getCategoryName());
        }

        if (product.getSeller() != null) {
            dto.setSellerId(product.getSeller().getUserId());
            dto.setSellerName(product.getSeller().getSellerDisplayName() != null
                    ? product.getSeller().getSellerDisplayName()
                    : product.getSeller().getUsername());
        }

        return dto;
    }

    public void updateEntity(Product product, ProductRequestDTO dto) {
        product.setProductName(dto.getProductName());
        product.setDescription(dto.getDescription());
        product.setRetailPrice(dto.getRetailPrice());
        product.setDiscountPercent(dto.getDiscountPercent());
        product.setPrimaryImageUrl(dto.getPrimaryImageUrl());

        product.clearSecondaryImages();
        if (dto.getSecondaryImageUrls() != null) {
            dto.getSecondaryImageUrls().forEach(product::addSecondaryImage);
        }

        product.setPhysicalQty(dto.getPhysicalQty());
        product.setActive(dto.isActive());
    }
}
