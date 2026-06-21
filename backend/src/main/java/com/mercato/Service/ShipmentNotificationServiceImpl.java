package com.mercato.Service;

import com.mercato.Entity.fulfillment.Order;
import com.mercato.Repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ShipmentNotificationServiceImpl implements ShipmentNotificationService {

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public boolean notifyShippedIfNeeded(Order order) {
        if (order.getShipmentEmailSentAt() != null) {
            return false;
        }

        emailService.sendOrderShippedEmail(
                order.getCustomerEmail(),
                order.getCustomerName(),
                order.getOrderId()
        );
        order.setShipmentEmailSentAt(Instant.now());
        orderRepository.save(order);
        return true;
    }
}
