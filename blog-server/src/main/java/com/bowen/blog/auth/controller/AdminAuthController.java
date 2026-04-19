package com.bowen.blog.auth.controller;

import com.bowen.blog.auth.dto.LoginRequest;
import com.bowen.blog.auth.service.AdminAuthService;
import com.bowen.blog.auth.vo.LoginResponse;
import com.bowen.blog.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.success(adminAuthService.login(request));
    }
}
