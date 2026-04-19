package com.bowen.blog.common;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.NoSuchElementException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    @Test
    void handlerReturnsApiResponseForUnhandledException() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new ThrowingController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/test/error"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Internal server error"));
    }

    @Test
    void handlerReturnsBadRequestForIllegalArgumentException() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new IllegalArgumentController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/test/illegal-argument"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("bad request"));
    }

    @Test
    void handlerReturnsNotFoundForNoSuchElementException() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new NotFoundController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/test/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("not found"));
    }

    @RestController
    public static class ThrowingController {

        @GetMapping("/test/error")
        String error() {
            throw new IllegalStateException("boom");
        }
    }

    @RestController
    public static class IllegalArgumentController {

        @GetMapping("/test/illegal-argument")
        String error() {
            throw new IllegalArgumentException("bad request");
        }
    }

    @RestController
    public static class NotFoundController {

        @GetMapping("/test/not-found")
        String error() {
            throw new NoSuchElementException("not found");
        }
    }
}
