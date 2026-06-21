package com.mercato.order;

import com.mercato.Entity.fulfillment.Order;
import com.mercato.Entity.fulfillment.OrderLine;
import com.mercato.Entity.fulfillment.OrderLineStatus;
import com.mercato.Entity.fulfillment.OrderStatus;
import com.mercato.Entity.fulfillment.payment.Payment;
import com.mercato.Entity.fulfillment.payment.PaymentStatus;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class OrderStateTransitionTest {

    @Test
    void confirmOrder_movesCreatedOrderAndLinesToConfirmed() {
        Order order = new Order();
        order.setOrderStatus(OrderStatus.CREATED);
        order.setPaymentStatus(PaymentStatus.INITIATED);

        OrderLine line = new OrderLine();
        line.setOrderLineStatus(OrderLineStatus.CREATED);
        order.addOrderLine(line);

        order.confirmOrder();

        assertEquals(OrderStatus.CONFIRMED, order.getOrderStatus());
        assertEquals(PaymentStatus.SUCCESS, order.getPaymentStatus());
        assertEquals(OrderLineStatus.CONFIRMED, line.getOrderLineStatus());
    }

    @Test
    void confirmOrder_isNoOpWhenAlreadyConfirmed() {
        Order order = new Order();
        order.setOrderStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.SUCCESS);

        order.confirmOrder();

        assertEquals(OrderStatus.CONFIRMED, order.getOrderStatus());
        assertEquals(PaymentStatus.SUCCESS, order.getPaymentStatus());
    }

    @Test
    void attachPayment_rejectsWhenOrderIsNotCreated() {
        Order order = new Order();
        order.setOrderStatus(OrderStatus.CONFIRMED);

        Payment payment = new Payment();
        payment.setAmount(BigDecimal.TEN);
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.INITIATED);

        assertThrows(IllegalStateException.class, () -> order.attachPayment(payment));
    }

    @Test
    void attachPayment_linksPaymentWhileOrderIsCreated() {
        Order order = new Order();
        order.setOrderStatus(OrderStatus.CREATED);

        Payment payment = new Payment();
        payment.setAmount(BigDecimal.TEN);
        payment.setCurrency("INR");
        payment.setStatus(PaymentStatus.INITIATED);

        order.attachPayment(payment);

        assertEquals(payment, order.getPayment());
        assertEquals(order, payment.getOrder());
    }
}
