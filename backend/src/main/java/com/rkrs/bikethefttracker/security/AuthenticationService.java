package com.rkrs.bikethefttracker.security;

import com.rkrs.bikethefttracker.dto.*;
import com.rkrs.bikethefttracker.entity.Role;
import com.rkrs.bikethefttracker.entity.RoleType;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.exception.UserAlreadyExistsException;
import com.rkrs.bikethefttracker.service.RoleService;
import com.rkrs.bikethefttracker.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final JwtContext jwtContext;

    public AuthenticationService(AuthenticationManager authenticationManager, UserService userService, RoleService roleService, PasswordEncoder passwordEncoder, JwtService jwtService, RefreshTokenService refreshTokenService, JwtContext jwtContext) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.jwtContext = jwtContext;
    }

    @Transactional
    public RegisterUserResponse register(RegisterUserRequest userInfo) {
        if (userService.userExistsWithUsername(userInfo.username())) {
            throw new UserAlreadyExistsException(userInfo.username());
        }

        Role defaultRole = roleService.getRole(RoleType.ROLE_USER);
        String passwordHash = passwordEncoder.encode(userInfo.password());

        User createdUser = userService.createUser(userInfo, defaultRole, passwordHash);

        return new RegisterUserResponse(createdUser.getUsername(),
                "Registration successfully. You can now login.");
    }

    @Transactional
    public LoginResult login(LoginRequest loginDetails) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDetails.username(), loginDetails.password())
        );
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        JwtToken accessToken = this.createAccessToken(userDetails);
        JwtToken refreshToken = this.createRefreshToken(userDetails);
        LoginResponse loginResponse = new LoginResponse(userDetails.getUserEntity().getId(), userDetails.getUsername());

        return new LoginResult(loginResponse, accessToken, refreshToken);
    }

    public void logout() {
        refreshTokenService.deleteByJwtId(this.getJti());
    }

    private JwtToken createAccessToken(UserDetails userDetails) {
        return jwtService.generateAccessToken(userDetails);
    }

    private JwtToken createRefreshToken(CustomUserDetails userDetails) {
        JwtToken refreshToken = jwtService.generateRefreshToken(userDetails);
        refreshTokenService.saveRefreshToken(refreshToken, userDetails.getUserEntity());

        return refreshToken;
    }

    private UUID getJti() {
        return UUID.fromString(jwtContext.getClaims().getId());
    }
}
