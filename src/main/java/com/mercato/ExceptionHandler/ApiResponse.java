package com.mercato.ExceptionHandler;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private String message;
    private boolean error;
}
