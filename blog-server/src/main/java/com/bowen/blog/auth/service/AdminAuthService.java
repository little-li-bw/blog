package com.bowen.blog.auth.service;

import com.bowen.blog.auth.dto.LoginRequest;
import com.bowen.blog.auth.entity.AdminUser;
import com.bowen.blog.auth.mapper.AdminUserMapper;
import com.bowen.blog.auth.vo.LoginResponse;
import com.bowen.blog.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final AdminUserMapper adminUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AdminAuthService(AdminUserMapper adminUserMapper,
                            PasswordEncoder passwordEncoder,
                            JwtTokenProvider jwtTokenProvider) {
        this.adminUserMapper = adminUserMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponse login(LoginRequest request) {
        AdminUser adminUser = adminUserMapper.findByUsername(request.username());
        if (adminUser == null || !passwordEncoder.matches(request.password(), adminUser.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String token = jwtTokenProvider.createToken(adminUser.getId(), adminUser.getUsername());
        return new LoginResponse(token, adminUser.getUsername(), adminUser.getNickname());
    }
}
