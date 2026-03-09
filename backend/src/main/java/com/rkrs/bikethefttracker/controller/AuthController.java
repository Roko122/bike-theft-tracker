package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.*;
import com.rkrs.bikethefttracker.properties.JwtProperties;
import com.rkrs.bikethefttracker.security.AuthenticationService;
import com.rkrs.bikethefttracker.util.CookiesUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final CookiesUtil cookiesUtil;
    private final JwtProperties jwtProperties;

    public AuthController(AuthenticationService authenticationService, CookiesUtil cookiesUtil, JwtProperties jwtProperties) {
        this.authenticationService = authenticationService;
        this.cookiesUtil = cookiesUtil;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponse> registerUser(@Valid @RequestBody RegisterUserRequest registerUserRequest) {
        return new ResponseEntity<>(authenticationService.register(registerUserRequest), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResult loginResult = authenticationService.login(loginRequest);

        ResponseCookie refreshTokenCookie = this.getRefreshTokenCookie(loginResult.refreshToken());
        ResponseCookie accessTokenCookie = this.getAccessTokenCookie(loginResult.accessToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString(), accessTokenCookie.toString())
                .body(loginResult.loginResponse());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String refreshToken = this.getRefreshToken(request);

        authenticationService.logout(refreshToken);
        return ResponseEntity.noContent().build();
    }

    @PostMapping()

    private ResponseCookie getRefreshTokenCookie(JwtToken refreshToken) {
        return cookiesUtil.createHttpOnlyCookie(
                refreshToken,
                jwtProperties.refreshTokenCookieName(),
                jwtProperties.refreshTokenExpirationTime());
    }

    private ResponseCookie getAccessTokenCookie(JwtToken accessToken) {
        return cookiesUtil.createHttpOnlyCookie(
                accessToken,
                jwtProperties.accessTokenCookieName(),
                jwtProperties.accessTokenExpirationTime()
        );
    }

    private String getRefreshToken(HttpServletRequest request) {
        String refreshTokenCookieName = jwtProperties.refreshTokenCookieName();
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals(refreshTokenCookieName))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
    }
}
