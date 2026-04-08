package com.rkrs.bikethefttracker.mapper;

import com.rkrs.bikethefttracker.dto.BikeResponse;
import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
import com.rkrs.bikethefttracker.dto.UserResponse;
import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.entity.TheftReport;
import org.springframework.stereotype.Component;

@Component
public class BikeMapper {

    private final UserMapper userMapper;

    public BikeMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public BikeResponse toBikeResponse(TheftReport theftReport) {
        UserResponse owner = userMapper.toUserResponse(theftReport.getUser());
        Bike bike = theftReport.getBike();

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
