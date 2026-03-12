package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.RegisterUserRequest;
import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(RegisterUserRequest userInfo, Role defaultRole, String passwordHash) {
        User userToCreate = new User();
        userToCreate.setUsername(userInfo.username());
        userToCreate.setPassword(passwordHash);
        userToCreate.setEmail(userInfo.email());
        userToCreate.getRoles().add(defaultRole);

        return userRepository.save(userToCreate);
    }

    public boolean userExistsWithUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
