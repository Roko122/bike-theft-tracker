package com.rkrs.bikethefttracker.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username) {
        super("User with username with " + username + " already exists.");
    }
}
