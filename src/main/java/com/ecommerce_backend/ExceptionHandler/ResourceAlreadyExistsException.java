package com.ecommerce_backend.ExceptionHandler;

public class ResourceAlreadyExistsException extends RuntimeException {
    public ResourceAlreadyExistsException(String resource, String fieldName, String fieldValue) {
        super(resource + " already exists with " + fieldName + "=" + fieldValue);
    }
}
