package com.mercato.Service;

import com.mercato.Entity.cart.Cart;
import com.mercato.Entity.fulfillment.Order;
import com.mercato.Entity.fulfillment.OrderLine;
import com.mercato.Entity.fulfillment.OrderLineAction;

public interface OrderReservationService {
    void reserveForOrder(Order order);

    void transferCartReservationsToOrder(Order order, Cart cart);

    /**
     * Idempotent inventory finalization after payment success (webhook, poll, or duplicate delivery).
     * Ensures exactly one order reservation per line and reconciles orphaned cart holds.
     *
     * @return true when this invocation created the order reservations (primary finalizer);
     *         false when inventory was already finalized or a concurrent peer won the insert race
     */
    boolean finalizeInventoryForPaidOrder(Order order, Cart cart);

    void settleQty(OrderLine orderLine, int qty, OrderLineAction action);
}
