package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.properties.JwtProperties;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
@EnableConfigurationProperties(JwtProperties.class)
public class JwtService {

    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public String generateAccessToken() {
        return null;
    }

    public String generateRefreshToken() {
        return null;
    }

    public boolean isTokenValid() {
        return false;
    }

    public boolean isRefreshTokenValid() {
        return false;
    }

    public String extractUsername() {
        return null;
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.secret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
