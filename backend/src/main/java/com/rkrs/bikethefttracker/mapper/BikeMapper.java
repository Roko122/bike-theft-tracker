package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.domain.Bike;
import com.rkrs.bikethefttracker.domain.User;
import com.rkrs.bikethefttracker.dto.BikeInfo;
import com.rkrs.bikethefttracker.dto.BikeResponse;
import com.rkrs.bikethefttracker.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class BikeMapper {

    private final UserMapper userMapper;

    public BikeMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public BikeResponse toBikeResponse(Bike bike) {
        UserResponse owner = userMapper.toUserResponse(bike.getOwner());

        return new BikeResponse(
                bike.getId(),
                bike.getBrand(),
                bike.getModel(),
                bike.getType(),
                bike.getColor(),
                bike.getSerialNumber(),
                bike.getDescription(),
                owner
        );
    }

    public Bike toBike(BikeInfo bikeInfo) {
        User user = userMapper.toUser(bikeInfo.owner());

        return Bike.builder()
                .brand(bikeInfo.brand())
                .model(bikeInfo.model())
                .type(bikeInfo.type())
                .color(bikeInfo.color())
                .serialNumber(bikeInfo.serialNumber())
                .description(bikeInfo.description())
                .owner(user)
                .build();
    }
}
