package com.rkrs.bikethefttracker.filter;

import com.rkrs.bikethefttracker.properties.JwtProperties;
import com.rkrs.bikethefttracker.security.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@EnableConfigurationProperties(JwtProperties.class)
@Slf4j
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final JwtProperties jwtProperties;

    public JwtFilter(JwtService jwtService, UserDetailsService userDetailsService, JwtProperties jwtProperties) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.jwtProperties = jwtProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (request.getServletPath().equals("/api/v1/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String accessToken = getAccessTokenFromCookies(request);
            Claims accessTokenClaims = jwtService.parseToken(accessToken);
            if (accessTokenClaims != null && jwtService.isTokenValid(accessTokenClaims)) {
                setAuthentication(accessTokenClaims);
            }
        } catch (Exception e) {
            log.warn("Received invalid auth token from IP {} on {}",
                    request.getRemoteAddr(),
                    request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }

    private String getAccessTokenFromCookies(HttpServletRequest request) {
        String cookieName = jwtProperties.accessTokenCookieName();
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(cookieName)) {
                return cookie.getValue();
            }
        }

        return null;
    }

    private void setAuthentication(Claims accessTokenClaims) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(accessTokenClaims.getSubject());
        Authentication auth = UsernamePasswordAuthenticationToken.authenticated(
                userDetails,
                null,
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
