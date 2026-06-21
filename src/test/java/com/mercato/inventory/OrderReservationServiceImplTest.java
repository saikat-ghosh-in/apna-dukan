package com.mercato.inventory;

import com.mercato.Entity.Product;
import com.mercato.Entity.fulfillment.Order;
import com.mercato.Entity.fulfillment.OrderLine;
import com.mercato.Entity.fulfillment.OrderReservation;
import com.mercato.Repository.OrderReservationRepository;
import com.mercato.Repository.ProductRepository;
import com.mercato.Service.OrderReservationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderReservationServiceImplTest {

    @Mock
    private OrderReservationRepository orderReservationRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderReservationServiceImpl orderReservationService;

    @Test
    void reserveForOrder_incrementsReservedQtyAndPersistsReservation() {
        Order order = new Order();
        OrderLine line = new OrderLine();
        line.setId(1L);
        line.setProductId("P-100");
        line.setOrderedQty(2);
        order.addOrderLine(line);

        Product product = Product.builder()
                .productId("P-100")
                .physicalQty(10)
                .reservedQty(1)
                .build();

        when(orderReservationRepository.findByOrderLine_Id(1L)).thenReturn(Optional.empty());
        when(productRepository.findByProductIdForUpdate("P-100")).thenReturn(Optional.of(product));

        orderReservationService.reserveForOrder(order);

        assertEquals(3, product.getReservedQty());
        verify(productRepository).save(product);

        ArgumentCaptor<OrderReservation> captor = ArgumentCaptor.forClass(OrderReservation.class);
        verify(orderReservationRepository).save(captor.capture());
        assertEquals(2, captor.getValue().getReservedQty());
        assertEquals(line, captor.getValue().getOrderLine());
    }

    @Test
    void reserveForOrder_skipsWhenReservationAlreadyExists() {
        Order order = new Order();
        OrderLine line = new OrderLine();
        line.setId(2L);
        line.setProductId("P-200");
        line.setOrderedQty(1);
        order.addOrderLine(line);

        when(orderReservationRepository.findByOrderLine_Id(2L))
                .thenReturn(Optional.of(OrderReservation.builder().build()));

        orderReservationService.reserveForOrder(order);

        verify(productRepository, never()).findByProductIdForUpdate(any());
        verify(orderReservationRepository, never()).save(any());
    }
}
