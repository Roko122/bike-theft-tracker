package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
