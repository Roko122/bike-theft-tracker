package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.UserDetailsResponse;
import com.rkrs.bikethefttracker.dto.UserResponse;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.security.CustomUserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername()
        );
    }

    public UserDetailsResponse toUserDetailsResponse(CustomUserDetails user) {
        return new UserDetailsResponse(
                user.getUserEntity().getId(),
                user.getUsername(),
                user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList()
        );
    }
}
