package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.domain.TheftReport;
import com.rkrs.bikethefttracker.domain.User;
import com.rkrs.bikethefttracker.dto.OwnerInfo;
import com.rkrs.bikethefttracker.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toUserResponse(TheftReport theftReport) {
        User user = theftReport.getBike().getOwner();
        return new UserResponse(
                user.getId(),
                user.getUsername()
        );
    }

    public User toUser(OwnerInfo ownerInfo) {
        return User.builder()
                .email(ownerInfo.email())
                .username(ownerInfo.username())
                .build();
    }
}
