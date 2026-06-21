package com.mercato.payment;

import com.mercato.Entity.fulfillment.Order;
import com.mercato.Entity.fulfillment.OrderStatus;
import com.mercato.Entity.fulfillment.payment.Payment;
import com.mercato.Entity.fulfillment.payment.PaymentStatus;
import com.mercato.Repository.OrderRepository;
import com.mercato.Repository.PaymentRepository;
import com.mercato.Repository.RefundRepository;
import com.mercato.Repository.UserRepository;
import com.mercato.Service.CartService;
import com.mercato.Service.CashfreeServiceImpl;
import com.mercato.Service.EmailService;
import com.mercato.Service.OrderReservationService;
import com.mercato.Utils.AuthUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CashfreePaymentWebhookTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderReservationService orderReservationService;
    @Mock private CartService cartService;
    @Mock private UserRepository userRepository;
    @Mock private AuthUtil authUtil;
    @Mock private EmailService emailService;
    @Mock private RestTemplate restTemplate;
    @Mock private RefundRepository refundRepository;

    private CashfreeServiceImpl cashfreeService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        cashfreeService = new CashfreeServiceImpl(
                paymentRepository,
                orderRepository,
                orderReservationService,
                cartService,
                userRepository,
                authUtil,
                emailService,
                restTemplate,
                objectMapper,
                refundRepository
        );
        ReflectionTestUtils.setField(cashfreeService, "secretKey", "test-secret");
    }

    @Test
    void paymentFailedWebhook_updatesPaymentAndOrderPaymentStatusWhileKeepingOrderCreated() throws Exception {
        String payload = """
                {
                  "type": "PAYMENT_FAILED_WEBHOOK",
                  "data": {
                    "order": { "order_id": "ORD-1" },
                    "payment": {
                      "cf_payment_id": "PAY-1",
                      "payment_message": "Insufficient balance"
                    }
                  }
                }
                """;

        Payment payment = new Payment();
        payment.setStatus(PaymentStatus.INITIATED);
        payment.setAmount(BigDecimal.TEN);

        Order order = new Order();
        order.setOrderId("ORD-1");
        order.setOrderStatus(OrderStatus.CREATED);
        order.attachPayment(payment);

        when(paymentRepository.findByOrder_OrderId("ORD-1")).thenReturn(Optional.of(payment));
        when(orderRepository.findByOrderId("ORD-1")).thenReturn(Optional.of(order));

        long timestamp = System.currentTimeMillis() / 1000;
        String signature = hmacSignature(timestamp + payload, "test-secret");

        cashfreeService.handleWebhookEvent(payload, signature, String.valueOf(timestamp));

        assertEquals(PaymentStatus.FAILED, payment.getStatus());
        assertEquals(PaymentStatus.FAILED, order.getPaymentStatus());
        assertEquals(OrderStatus.CREATED, order.getOrderStatus());
        verify(paymentRepository).save(payment);
        verify(orderRepository).save(order);
    }

    private static String hmacSignature(String data, String secret) throws Exception {
        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
        mac.init(new javax.crypto.spec.SecretKeySpec(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
}
