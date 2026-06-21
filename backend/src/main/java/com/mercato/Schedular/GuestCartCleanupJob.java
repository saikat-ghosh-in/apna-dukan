package com.mercato.Schedular;

import com.mercato.Entity.cart.Cart;
import com.mercato.Repository.CartRepository;
import com.mercato.Service.CartReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GuestCartCleanupJob {

    private final CartRepository cartRepository;
    private final CartReservationService cartReservationService;

    @Scheduled(cron = "0 0 2 * * *", zone = "UTC")
    @Transactional
    public void purgeAbandonedGuestCarts() {
        Instant cutoff = Instant.now().minus(8, ChronoUnit.DAYS);
        List<Cart> staleCarts = cartRepository.findStaleGuestCarts(cutoff);
        staleCarts.forEach(cart -> {
            cartReservationService.releaseAllForCart(cart);
            cartRepository.delete(cart);
        });
    }
}
