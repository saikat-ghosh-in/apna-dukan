package com.mercato.Repository;

import com.mercato.Entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByUser_UserIdOrderByCreatedAtDesc(String userId);

    Optional<WishlistItem> findByUser_UserIdAndProduct_ProductId(String userId, String productId);

    boolean existsByUser_UserIdAndProduct_ProductId(String userId, String productId);
}
