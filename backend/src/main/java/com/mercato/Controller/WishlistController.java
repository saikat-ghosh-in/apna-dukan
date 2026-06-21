package com.mercato.Controller;

import com.mercato.Payloads.Response.ProductResponseDTO;
import com.mercato.Service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlist());
    }

    @GetMapping("/ids")
    public ResponseEntity<Set<String>> getWishlistIds() {
        return ResponseEntity.ok(wishlistService.getWishlistProductIds());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable String productId) {
        wishlistService.add(productId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable String productId) {
        wishlistService.remove(productId);
        return ResponseEntity.noContent().build();
    }
}
