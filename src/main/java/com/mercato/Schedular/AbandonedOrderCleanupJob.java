package com.mercato.Schedular;

import com.mercato.Entity.EcommUser;
import com.mercato.Entity.cart.Cart;
import com.mercato.Entity.cart.CartItem;
import com.mercato.Entity.fulfillment.Order;
import com.mercato.Entity.fulfillment.OrderLine;
import com.mercato.Entity.fulfillment.OrderStatus;
import com.mercato.Entity.fulfillment.payment.Payment;
import com.mercato.Entity.fulfillment.payment.PaymentStatus;
import com.mercato.Repository.OrderRepository;
import com.mercato.Repository.UserRepository;
import com.mercato.Service.CartReservationService;
import com.mercato.Service.CartService;
import com.mercato.Service.CashfreeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class AbandonedOrderCleanupJob {

    @Value("${order.payment.abandonment.hours:48}")
    private int abandonmentHours;

    private final OrderRepository orderRepository;
    private final CashfreeService cashfreeService;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final CartReservationService cartReservationService;

    @Scheduled(fixedDelayString = "${order.payment.abandonment.cleanup.interval.ms:3600000}")
    @Transactional
    public void cancelAbandonedUnpaidOrders() {
        Instant cutoff = Instant.now().minus(abandonmentHours, ChronoUnit.HOURS);
        List<Order> abandonedOrders = orderRepository.findAbandonedUnpaidOrders(cutoff);

        abandonedOrders.forEach(order -> {
            Payment payment = order.getPayment();
            if (payment == null) {
                return;
            }

            releaseCartHoldsForOrder(order);

            if (payment.getCfOrderId() != null) {
                cashfreeService.terminateOrder(payment.getCfOrderId());
            }

            payment.setStatus(PaymentStatus.CANCELLED);
            payment.setGatewayResponseMessage("Abandoned unpaid order auto-cancelled");
            order.setOrderStatus(OrderStatus.CANCELLED);
            order.setPaymentStatus(PaymentStatus.CANCELLED);
            orderRepository.save(order);

            log.info("Auto-cancelled abandoned unpaid order {}", order.getOrderId());
        });
    }

    private void releaseCartHoldsForOrder(Order order) {
        Set<String> orderProductIds = order.getOrderLines().stream()
                .map(OrderLine::getProductId)
                .collect(Collectors.toSet());

        userRepository.findByEmail(order.getCustomerEmail()).ifPresent(user ->
                releaseMatchingCartHolds(user, orderProductIds)
        );
    }

    private void releaseMatchingCartHolds(EcommUser user, Set<String> productIds) {
        Cart cart = cartService.getCartByUser(user);
        if (cart == null || cart.getCartItems() == null) {
            return;
        }

        List<CartItem> itemsToRelease = cart.getCartItems().stream()
                .filter(item -> productIds.contains(item.getProduct().getProductId()))
                .toList();

        itemsToRelease.forEach(cartReservationService::release);
    }
}
