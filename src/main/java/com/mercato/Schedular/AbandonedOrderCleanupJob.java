package com.mercato.Schedular;

import com.mercato.Entity.fulfillment.Order;
import com.mercato.Entity.fulfillment.OrderStatus;
import com.mercato.Entity.fulfillment.payment.Payment;
import com.mercato.Entity.fulfillment.payment.PaymentStatus;
import com.mercato.Repository.OrderRepository;
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

@Slf4j
@Component
@RequiredArgsConstructor
public class AbandonedOrderCleanupJob {

    @Value("${order.payment.abandonment.hours:48}")
    private int abandonmentHours;

    private final OrderRepository orderRepository;
    private final CashfreeService cashfreeService;

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
}
