package com.bowen.blog.auth.controller;

import com.bowen.blog.auth.dto.LoginRequest;
import com.bowen.blog.auth.service.AdminAuthService;
import com.bowen.blog.auth.vo.LoginResponse;
import com.bowen.blog.common.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminAuthControllerTest {

    @Test
    void loginEndpointReturnsJwtToken() throws Exception {
        AdminAuthService authService = mock(AdminAuthService.class);
        when(authService.login(new LoginRequest("admin", "secret")))
                .thenReturn(new LoginResponse("jwt-token", "admin", "Bowen"));

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AdminAuthController(authService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "admin",
                                  "password": "secret"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("jwt-token"))
                .andExpect(jsonPath("$.data.username").value("admin"))
                .andExpect(jsonPath("$.data.nickname").value("Bowen"));
    }
}
