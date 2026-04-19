package com.bowen.blog.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ApiResponseTest {

    @Test
    void successFactoryCreatesSuccessfulResponse() {
        ApiResponse<String> response = ApiResponse.success("ok");

        assertTrue(response.success());
        assertEquals("Success", response.message());
        assertEquals("ok", response.data());
    }

    @Test
    void errorFactoryCreatesFailureResponseWithoutData() {
        ApiResponse<Void> response = ApiResponse.error("Unexpected error");

        assertFalse(response.success());
        assertEquals("Unexpected error", response.message());
        assertNull(response.data());
    }
}
