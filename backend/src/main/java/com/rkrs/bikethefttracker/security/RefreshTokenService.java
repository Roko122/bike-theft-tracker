package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.dto.JwtToken;
import com.rkrs.bikethefttracker.entity.RefreshToken;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public boolean isTokenValid(UUID jwtId) {
        return refreshTokenRepository.findByJwtId(jwtId).isPresent();
    }

    public void deleteByJwtId(UUID jwtId) {
        refreshTokenRepository.deleteAllByJwtId(jwtId);
    }

    public void deleteAllByUser(User user) {
        refreshTokenRepository.deleteAllByUser(user);
    }

    public RefreshToken saveRefreshToken(JwtToken jwtToken, User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setJwtId(jwtToken.jwtId());
        refreshToken.setExpiryTime(jwtToken.expiryTime().toInstant());
        refreshToken.setUser(user);

        return refreshTokenRepository.save(refreshToken);
    }
}
