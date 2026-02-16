package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.domain.Bike;
import com.rkrs.bikethefttracker.domain.User;
import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
import com.rkrs.bikethefttracker.mapper.BikeMapper;
import com.rkrs.bikethefttracker.repository.BikeRepository;
import org.springframework.stereotype.Service;

@Service
public class BikeService {

    private final BikeMapper bikeMapper;
    private final BikeRepository bikeRepository;

    public BikeService(BikeMapper bikeMapper, BikeRepository bikeRepository) {
        this.bikeMapper = bikeMapper;
        this.bikeRepository = bikeRepository;
    }

    public Bike createBike(CreateBikeRequest bike, User user) {
        Bike bikeToCreate = bikeMapper.toBike(bike);
        bikeToCreate.setUser(user);
        return bikeRepository.save(bikeToCreate);
    }
}
