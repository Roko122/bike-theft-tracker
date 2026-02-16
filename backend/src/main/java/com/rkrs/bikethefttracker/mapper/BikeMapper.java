package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.domain.Bike;
import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
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
        UserResponse owner = userMapper.toUserResponse(bike.getUser());

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

    public Bike toBike(CreateBikeRequest createBikeRequest) {
        return Bike.builder()
                .brand(createBikeRequest.brand())
                .model(createBikeRequest.model())
                .type(createBikeRequest.type())
                .color(createBikeRequest.color())
                .serialNumber(createBikeRequest.serialNumber())
                .description(createBikeRequest.description())
                .build();
    }
}
