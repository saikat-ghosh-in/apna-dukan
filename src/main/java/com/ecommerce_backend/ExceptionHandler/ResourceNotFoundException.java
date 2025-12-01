package com.ecommerce_backend.ExceptionHandler;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String fieldName, String fieldValue) {
        super(resource + " does not exist with " + fieldName + "=" + fieldValue);
    }
}