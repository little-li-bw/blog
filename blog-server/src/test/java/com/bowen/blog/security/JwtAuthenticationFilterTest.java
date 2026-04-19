package com.bowen.blog.security;

import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("JWT认证过滤器单元测试")
class JwtAuthenticationFilterTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Nested
    @DisplayName("过滤认证头")
    class FilterAuthorizationHeader {

        @Test
        @DisplayName("无认证头时 - 不写入认证上下文")
        void testDoFilterInternal_NoAuthorizationHeader_NoAuthentication() throws ServletException, IOException {
            JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtTokenProvider);
            MockHttpServletRequest request = new MockHttpServletRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain chain = new MockFilterChain();

            filter.doFilter(request, response, chain);

            assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
            assertThat(response.getStatus()).isEqualTo(200);
            verify(jwtTokenProvider, never()).isValid(org.mockito.ArgumentMatchers.anyString());
        }

        @Test
        @DisplayName("Token无效时 - 不写入认证上下文")
        void testDoFilterInternal_InvalidToken_NoAuthentication() throws ServletException, IOException {
            JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtTokenProvider);
            MockHttpServletRequest request = new MockHttpServletRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain chain = new MockFilterChain();
            request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer invalid-token");

            when(jwtTokenProvider.isValid("invalid-token")).thenReturn(false);

            filter.doFilter(request, response, chain);

            assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
            verify(jwtTokenProvider, never()).getUsername("invalid-token");
        }

        @Test
        @DisplayName("Token有效时 - 写入用户名认证上下文")
        void testDoFilterInternal_ValidToken_SetAuthentication() throws ServletException, IOException {
            JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtTokenProvider);
            MockHttpServletRequest request = new MockHttpServletRequest();
            MockHttpServletResponse response = new MockHttpServletResponse();
            MockFilterChain chain = new MockFilterChain();
            request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer valid-token");

            when(jwtTokenProvider.isValid("valid-token")).thenReturn(true);
            when(jwtTokenProvider.getUsername("valid-token")).thenReturn("admin");

            filter.doFilter(request, response, chain);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            assertThat(authentication).isNotNull();
            assertThat(authentication.getPrincipal()).isEqualTo("admin");
            assertThat(authentication.getAuthorities()).isEmpty();
            assertThat(authentication.getDetails()).isNotNull();
        }
    }
}
