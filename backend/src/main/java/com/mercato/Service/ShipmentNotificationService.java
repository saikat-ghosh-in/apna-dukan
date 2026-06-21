package com.mercato.Service;

import com.mercato.Entity.fulfillment.Order;

public interface ShipmentNotificationService {

    /**
     * Sends at most one shipped email per order, regardless of how many SHIP actions occur.
     *
     * @return true when this call sent the email
     */
    boolean notifyShippedIfNeeded(Order order);
}
