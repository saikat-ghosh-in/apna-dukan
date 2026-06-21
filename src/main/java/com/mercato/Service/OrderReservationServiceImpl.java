package com.mercato.Service;

import com.mercato.Entity.Product;
import com.mercato.Entity.cart.Cart;
import com.mercato.Entity.cart.CartItem;
import com.mercato.Entity.cart.CartReservation;
import com.mercato.Entity.fulfillment.Order;
import com.mercato.Entity.fulfillment.OrderLine;
import com.mercato.Entity.fulfillment.OrderLineAction;
import com.mercato.Entity.fulfillment.OrderReservation;
import com.mercato.ExceptionHandler.ResourceNotFoundException;
import com.mercato.Repository.CartReservationRepository;
import com.mercato.Repository.OrderReservationRepository;
import com.mercato.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderReservationServiceImpl implements OrderReservationService {

    private final OrderReservationRepository orderReservationRepository;
    private final ProductRepository productRepository;
    private final CartReservationRepository cartReservationRepository;

    @Override
    @Transactional
    public void reserveForOrder(Order order) {
        order.getOrderLines().forEach(line -> reserveOrderLine(order, line));
    }

    @Override
    @Transactional
    public void transferCartReservationsToOrder(Order order, Cart cart) {
        for (OrderLine orderLine : order.getOrderLines()) {
            if (orderReservationRepository.findByOrderLine_Id(orderLine.getId()).isPresent()) {
                log.warn("Order reservation already exists for orderLine: {}", orderLine.getId());
                continue;
            }

            cart.findItemByProductId(orderLine.getProductId())
                    .flatMap(cartItem -> cartReservationRepository
                            .findByCartItem_CartItemId(cartItem.getCartItemId()))
                    .ifPresentOrElse(
                            cartReservation -> transferSingleReservation(order, orderLine, cartReservation),
                            () -> reserveOrderLine(order, orderLine)
                    );
        }
    }

    private void transferSingleReservation(Order order, OrderLine orderLine, CartReservation cartReservation) {
        Product product = cartReservation.getProduct();
        cartReservationRepository.delete(cartReservation);

        OrderReservation reservation = OrderReservation.builder()
                .order(order)
                .orderLine(orderLine)
                .product(product)
                .reservedQty(orderLine.getOrderedQty())
                .build();

        orderReservationRepository.save(reservation);
        log.info("Transferred cart reservation to order line {} for product {}",
                orderLine.getId(), orderLine.getProductId());
    }

    private void reserveOrderLine(Order order, OrderLine orderLine) {
        if (orderReservationRepository.findByOrderLine_Id(orderLine.getId()).isPresent()) {
            log.warn("Order reservation already exists for orderLine: {}", orderLine.getId());
            return;
        }

        Product product = productRepository.findByProductIdForUpdate(orderLine.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product", "productId", orderLine.getProductId()
                ));

        product.adjustReservedQty(orderLine.getOrderedQty());
        productRepository.save(product);

        OrderReservation reservation = OrderReservation.builder()
                .order(order)
                .orderLine(orderLine)
                .product(product)
                .reservedQty(orderLine.getOrderedQty())
                .build();

        orderReservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public void settleQty(OrderLine orderLine, int qty, OrderLineAction action) {
        OrderReservation reservation = orderReservationRepository
                .findByOrderLine_Id(orderLine.getId())
                .orElse(null);

        Product product = productRepository.findByProductIdForUpdate(orderLine.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product", "productId", orderLine.getProductId()
                ));

        switch (action) {
            case SHIP -> {
                product.adjustInventory(-qty);
                if (reservation != null) {
                    product.adjustReservedQty(-qty);
                }
            }
            case CANCEL -> {
                if (reservation != null) {
                    product.adjustReservedQty(-qty);
                }
            }
            default -> throw new IllegalStateException(
                    "Cannot settle qty for action: " + action
            );
        }

        productRepository.save(product);

        if (reservation != null) {
            if (orderLine.isTerminal()) {
                orderReservationRepository.delete(reservation);
            } else {
                reservation.setReservedQty(reservation.getReservedQty() - qty);
                orderReservationRepository.save(reservation);
            }
        }
    }
}
