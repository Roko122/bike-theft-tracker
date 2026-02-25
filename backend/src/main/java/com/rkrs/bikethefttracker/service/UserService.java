package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.dto.CreateUserRequest;
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
}
