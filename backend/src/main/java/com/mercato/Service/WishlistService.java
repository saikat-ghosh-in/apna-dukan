package com.mercato.Service;

import com.mercato.Payloads.Response.ProductResponseDTO;

import java.util.List;
import java.util.Set;

public interface WishlistService {

    List<ProductResponseDTO> getWishlist();

    Set<String> getWishlistProductIds();

    void add(String productId);

    void remove(String productId);
}
