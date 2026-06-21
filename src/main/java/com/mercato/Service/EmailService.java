package com.mercato.Service;

import java.math.BigDecimal;

public interface EmailService {

    void sendVerificationEmail(String to, String username, String token);

    void sendWelcomeEmail(String to, String username);

    void sendReactivationConfirmationEmail(String to, String username);

    void sendOrderConfirmationEmail(String to, String username, String orderId, BigDecimal totalAmount);

    void sendPasswordResetEmail(String to, String username, String token);
}
