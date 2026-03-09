package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.dto.JwtToken;
import com.rkrs.bikethefttracker.entity.RefreshToken;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.exception.InvalidRefreshTokenException;
import com.rkrs.bikethefttracker.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken getToken(UUID jwtId) {
        return refreshTokenRepository.findByJwtId(jwtId)
                .orElseThrow(() -> new InvalidRefreshTokenException("Invalid refresh token. Please log in again."));
    }

    @Transactional
    public void deleteByJwtId(UUID jwtId) {
        refreshTokenRepository.deleteAllByJwtId(jwtId);
    }

    @Transactional
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
