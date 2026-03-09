package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.dto.JwtToken;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.properties.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Service
@EnableConfigurationProperties(JwtProperties.class)
public class JwtService {

    private final JwtProperties jwtProperties;
    private final JwtContext jwtContext;

    public JwtService(JwtProperties jwtProperties, JwtContext jwtContext) {
        this.jwtProperties = jwtProperties;
        this.jwtContext = jwtContext;
    }

    public JwtToken generateAccessToken(User user) {
        return buildJwtToken(user, jwtProperties.accessTokenExpirationTime(), null);
    }

    public JwtToken generateRefreshToken(User user) {
        return buildJwtToken(user, jwtProperties.refreshTokenExpirationTime(), UUID.randomUUID());
    }

    public boolean isTokenValid(Claims claims) {
        Date expiryTime = claims.getExpiration();

        return expiryTime.after(new Date());
    }

    public Claims parseToken(String token) {
        Claims claims = extractAllClaims(token);
        jwtContext.setToken(token);
        jwtContext.setClaims(claims);

        return claims;
    }

    private JwtToken buildJwtToken(User user, Long expirationTime, UUID jwtId) {
        Date now = new Date();
        Date expiryTime = new Date(System.currentTimeMillis() + expirationTime);

        String token = buildToken(user, now, expiryTime, jwtId);

        return new JwtToken(token, jwtId);
    }

    private String buildToken(User user, Date now, Date expiryTime, UUID jwtId) {
        JwtBuilder jwtBuilder = Jwts.builder()
                .subject(user.getUsername())
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
        //Checks signature
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
