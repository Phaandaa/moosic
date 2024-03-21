package com.example.server.config;

import org.springframework.stereotype.Component;

import com.example.server.service.VerifyIdTokenService;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;

@Component
public class TokenAuthenticationFilter implements Filter{
    private final VerifyIdTokenService verifyIdTokenService;

    public TokenAuthenticationFilter(VerifyIdTokenService verifyIdTokenService) {
        this.verifyIdTokenService = verifyIdTokenService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String authToken = httpRequest.getHeader("Authorization");

        try {
            if (authToken != null && !authToken.isEmpty()) {
                verifyIdTokenService.verifyIdToken(authToken.replace("Bearer ", ""));
            }
            chain.doFilter(request, response);
        } catch (Exception e) {
            throw new ServletException("Invalid token.");
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void destroy() {}
}
