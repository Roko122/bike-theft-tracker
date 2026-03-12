package com.rkrs.bikethefttracker.controller;

import com.rkrs.bikethefttracker.dto.*;
import com.rkrs.bikethefttracker.mapper.UserMapper;
import com.rkrs.bikethefttracker.properties.JwtProperties;
import com.rkrs.bikethefttracker.security.AuthenticationService;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import com.rkrs.bikethefttracker.util.CookiesUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationService authenticationService;
    private final CookiesUtil cookiesUtil;
    private final JwtProperties jwtProperties;
    private final UserMapper userMapper;

    public AuthController(AuthenticationService authenticationService, CookiesUtil cookiesUtil, JwtProperties jwtProperties, UserMapper userMapper) {
        this.authenticationService = authenticationService;
        this.cookiesUtil = cookiesUtil;
        this.jwtProperties = jwtProperties;
        this.userMapper = userMapper;
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

        ResponseCookie removeAccessTokenCookie = cookiesUtil.removeHttpOnlyCookie(jwtProperties.accessTokenCookieName());
        ResponseCookie removeRefreshTokenCookie = cookiesUtil.removeHttpOnlyCookie(jwtProperties.refreshTokenCookieName());

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, removeRefreshTokenCookie.toString(), removeAccessTokenCookie.toString())
                .build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshAccessToken(HttpServletRequest request) {
        String refreshToken = this.getRefreshToken(request);
        JwtToken newAccessToken = authenticationService.renewAccessToken(refreshToken);
        ResponseCookie accessTokenCookie = getAccessTokenCookie(newAccessToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetailsResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        UserDetailsResponse userDetailsResponse = userMapper.toUserDetailsResponse(customUserDetails);
        return new ResponseEntity<>(userDetailsResponse, HttpStatus.OK);
    }

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
