package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.RoleType;
import com.rkrs.bikethefttracker.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    public Role getRole(RoleType role) {
        return roleRepository.findByName(role)
                .orElseGet(() ->
                    roleRepository.save(new Role(role))
                );
    }
}
