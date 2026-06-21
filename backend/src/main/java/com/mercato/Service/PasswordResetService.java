package com.mercato.Service;

public interface PasswordResetService {

    void requestPasswordReset(String email);

    void resetPassword(String token, String newPassword);
}
