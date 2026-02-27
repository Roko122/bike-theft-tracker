package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.dto.LoginRequest;
import com.rkrs.bikethefttracker.dto.LoginResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public LoginResponse login(LoginRequest loginDetails) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDetails.username(), loginDetails.password())
        );
        CustomUserDetails loggedUser = (CustomUserDetails) auth.getPrincipal();

        return new LoginResponse(loggedUser.getId(), loggedUser.getUsername());
    }
}
