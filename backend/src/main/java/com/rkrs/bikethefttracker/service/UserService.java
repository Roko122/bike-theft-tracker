package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.CreateUserRequest;
import com.rkrs.bikethefttracker.dto.RegisterUserRequest;
import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.mapper.UserMapper;
import com.rkrs.bikethefttracker.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public UserService(UserMapper userMapper, UserRepository userRepository) {
        this.userMapper = userMapper;
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserRequest owner) {
        User userToCreate = userMapper.toUser(owner);
        return userRepository.save(userToCreate);
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
