package com.bowen.blog.auth.service;

import com.bowen.blog.auth.dto.LoginRequest;
import com.bowen.blog.auth.entity.AdminUser;
import com.bowen.blog.auth.mapper.AdminUserMapper;
import com.bowen.blog.auth.vo.LoginResponse;
import com.bowen.blog.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAuthServiceTest {

    @Mock
    private AdminUserMapper adminUserMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AdminAuthService service;

    @Test
    void loginReturnsTokenWhenCredentialsAreValid() {
        AdminUser adminUser = new AdminUser();
        adminUser.setId(1L);
        adminUser.setUsername("admin");
        adminUser.setPassword("encoded-password");
        adminUser.setNickname("Bowen");

        when(adminUserMapper.findByUsername("admin")).thenReturn(adminUser);
        when(passwordEncoder.matches("secret", "encoded-password")).thenReturn(true);
        when(jwtTokenProvider.createToken(1L, "admin")).thenReturn("jwt-token");

        LoginResponse response = service.login(new LoginRequest("admin", "secret"));

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.username()).isEqualTo("admin");
        assertThat(response.nickname()).isEqualTo("Bowen");
    }

    @Test
    void loginThrowsWhenPasswordIsInvalid() {
        AdminUser adminUser = new AdminUser();
        adminUser.setUsername("admin");
        adminUser.setPassword("encoded-password");

        when(adminUserMapper.findByUsername("admin")).thenReturn(adminUser);
        when(passwordEncoder.matches("wrong", "encoded-password")).thenReturn(false);

        assertThatThrownBy(() -> service.login(new LoginRequest("admin", "wrong")))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid username or password");
    }
}
