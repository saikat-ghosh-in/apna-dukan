package com.mercato.Service;

import com.mercato.Entity.EcommUser;
import com.mercato.Entity.PasswordResetToken;
import com.mercato.ExceptionHandler.CustomBadRequestException;
import com.mercato.Repository.PasswordResetTokenRepository;
import com.mercato.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${mercato.password-reset.expiry-hours:1}")
    private int expiryHours;

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            if (!user.isEnabled()) {
                log.info("Password reset skipped for disabled account: {}", email);
                return;
            }

            tokenRepository.deleteByUser_Id(user.getId());

            PasswordResetToken token = PasswordResetToken.builder()
                    .user(user)
                    .expiresAt(Instant.now().plus(expiryHours, ChronoUnit.HOURS))
                    .build();
            tokenRepository.save(token);

            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), token.getToken());
            log.info("Password reset token created for user: {}", user.getUserId());
        });
    }

    @Override
    @Transactional
    public void resetPassword(String tokenValue, String newPassword) {
        PasswordResetToken token = tokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new CustomBadRequestException("Invalid or expired reset link"));

        if (token.isUsed()) {
            throw new CustomBadRequestException("This reset link has already been used");
        }
        if (token.isExpired()) {
            throw new CustomBadRequestException("Reset link has expired. Please request a new one.");
        }

        EcommUser user = token.getUser();
        if (!user.isEnabled()) {
            throw new CustomBadRequestException("Account is deactivated");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsedAt(Instant.now());
        tokenRepository.save(token);

        log.info("Password reset completed for user: {}", user.getUserId());
    }
}
