package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
@EnableConfigurationProperties(JwtProperties.class)
public class JwtService {

    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(userDetails, jwtProperties.accessTokenExpirationTime());
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(userDetails, jwtProperties.refreshTokenExpirationTime());
    }

    public boolean isTokenValid(String token) {
        Claims claims = this.extractAllClaims(token); //checks signature
        Date expiryTime = claims.getExpiration();

        return expiryTime.after(new Date());
    }

    private String buildToken(UserDetails userDetails, Long expirationTime) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.secret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
