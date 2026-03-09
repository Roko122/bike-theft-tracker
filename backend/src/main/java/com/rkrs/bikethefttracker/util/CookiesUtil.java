package com.rkrs.bikethefttracker.util;

import com.rkrs.bikethefttracker.dto.JwtToken;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookiesUtil {

    public ResponseCookie createHttpOnlyCookie(JwtToken jwtToken, String cookieName, Long expirationTime) {
        return ResponseCookie.from(cookieName, jwtToken.token())
                .httpOnly(true)
                .secure(false) //this should be true in production (HTTPS)
                .path("/")
                .maxAge(Duration.ofMillis(expirationTime))
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie removeHttpOnlyCookie(String cookieName) {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(false) //this should be true in production (HTTPS)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
    }
}
