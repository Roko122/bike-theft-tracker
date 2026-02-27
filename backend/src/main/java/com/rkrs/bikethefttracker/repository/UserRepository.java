package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findUserByUsername(String username);

    boolean existsByUsername(String username);
}
