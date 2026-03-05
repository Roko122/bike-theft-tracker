package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.entity.RefreshToken;
import com.rkrs.bikethefttracker.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @EntityGraph(attributePaths = {"user"})
    Optional<RefreshToken> findByJwtId(UUID jwtId);

    void deleteAllByJwtId(UUID jwtId);

    void deleteAllByUser(User user);
}
