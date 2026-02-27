package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleType role);
}
