package com.bowen.blog.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("JWT令牌提供器单元测试")
class JwtTokenProviderTest {

    private static final String JWT_SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

    @Nested
    @DisplayName("Token生成与校验")
    class TokenLifecycle {

        @Test
        @DisplayName("生成有效Token后 - 可以提取用户名且校验通过")
        void testCreateToken_ValidToken_ReturnUsernameAndValid() {
            JwtTokenProvider tokenProvider = createProvider(3600);

            String token = tokenProvider.createToken(1L, "admin");

            assertThat(token).isNotBlank();
            assertThat(tokenProvider.isValid(token)).isTrue();
            assertThat(tokenProvider.getUsername(token)).isEqualTo("admin");
        }

        @Test
        @DisplayName("非法Token时 - 校验失败")
        void testIsValid_InvalidToken_ReturnFalse() {
            JwtTokenProvider tokenProvider = createProvider(3600);

            assertThat(tokenProvider.isValid("invalid-token")).isFalse();
        }

        @Test
        @DisplayName("过期Token时 - 校验失败")
        void testIsValid_ExpiredToken_ReturnFalse() {
            JwtTokenProvider tokenProvider = createProvider(-1);

            String token = tokenProvider.createToken(1L, "admin");

            assertThat(tokenProvider.isValid(token)).isFalse();
        }
    }

    private JwtTokenProvider createProvider(long expirationSeconds) {
        JwtTokenProvider tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", JWT_SECRET);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationSeconds", expirationSeconds);
        ReflectionTestUtils.invokeMethod(tokenProvider, "init");
        return tokenProvider;
    }
}
