package com.mercato.Payloads.Request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderCaptureRequestDTO {

    @NotNull(message = "addressId is required")
    private String addressId;
}
