package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.dto.JwtToken;
import com.rkrs.bikethefttracker.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Service
@EnableConfigurationProperties(JwtProperties.class)
public class JwtService {

    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public JwtToken generateAccessToken(UserDetails userDetails) {
        return buildJwtToken(userDetails, jwtProperties.accessTokenExpirationTime(), null);
    }

    public JwtToken generateRefreshToken(UserDetails userDetails) {
        return buildJwtToken(userDetails, jwtProperties.refreshTokenExpirationTime(), UUID.randomUUID());
    }

    public boolean isTokenValid(String token) {
        Claims claims = this.extractAllClaims(token); //checks signature
        Date expiryTime = claims.getExpiration();

        return expiryTime.after(new Date());
    }

    private JwtToken buildJwtToken(UserDetails userDetails, Long expirationTime, UUID jwtId) {
        Date now = new Date();
        Date expiryTime = new Date(System.currentTimeMillis() + expirationTime);

        String token = buildToken(userDetails, now, expiryTime, jwtId);

        return new JwtToken(token, expiryTime, jwtId);
    }

    private String buildToken(UserDetails userDetails, Date now, Date expiryTime, UUID jwtId) {
        JwtBuilder jwtBuilder = Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(expiryTime);

        if (jwtId != null) {
            jwtBuilder.id(jwtId.toString());
        }

        return jwtBuilder
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
