package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.*;
import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.exception.NotFoundException;
import com.rkrs.bikethefttracker.mapper.TheftReportMapper;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class TheftReportService {

    private final TheftReportRepository theftReportRepository;
    private final TheftReportMapper theftReportMapper;
    private final BikeService bikeService;
    private final ImageStorageService imageStorageService;

    public TheftReportService(TheftReportRepository theftReportRepository, TheftReportMapper theftReportMapper, BikeService bikeService, ImageStorageService imageStorageService) {
        this.theftReportRepository = theftReportRepository;
        this.theftReportMapper = theftReportMapper;
        this.bikeService = bikeService;
        this.imageStorageService = imageStorageService;
    }

    public List<TheftReportMapItemResponse> getAllTheftReportMapItems() {
        List<TheftReportMapItemData> mapItemsData = theftReportRepository.findAllTheftReportMapItems();

        return mapItemsData.stream().map(theftReportMapper::toTheftReportMapItemResponse).toList();
    }

    public List<TheftReportMapItemResponse> getAllVisibleTheftReportMapItems(double minLon,
                                                                             double minLat,
                                                                             double maxLon,
                                                                             double maxLat) {

        List<TheftReportMapItemData> mapItemsData =
                theftReportRepository.findAllVisibleTheftReportMapItems(minLon, minLat, maxLon, maxLat);

        return mapItemsData.stream().map(theftReportMapper::toTheftReportMapItemResponse).toList();
    }

    @Transactional
    public TheftReportResponse createTheftReport(CreateTheftReportRequest createTheftReportRequest,
                                                 User user,
                                                 List<MultipartFile> images) {

        Bike createdBike = this.createBikeWithImages(createTheftReportRequest.bike(), user, images);
        TheftReport createdTheftReport = this.createTheftReport(createTheftReportRequest, createdBike);

        return theftReportMapper.toTheftReportResponse(createdTheftReport);
    }

    public TheftReportResponse getTheftReportResponse(UUID id) {
        TheftReport theftReport = theftReportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("TheftReport with id " + id + "was not found."));

        return theftReportMapper.toTheftReportResponse(theftReport);
    }

    private Bike createBikeWithImages(CreateBikeRequest bikeDto, User user, List<MultipartFile> images) {
        Bike createdBike = bikeService.createBike(bikeDto, user);

        if (images != null) {
            List<String> imagePaths = imageStorageService.saveImages(images, createdBike.getId());
            bikeService.addImages(createdBike, imagePaths);
        }

        return createdBike;
    }

    private TheftReport createTheftReport(CreateTheftReportRequest theftReportDto, Bike createdBike) {
        TheftReport theftReportToSave = theftReportMapper.toTheftReport(theftReportDto);
        theftReportToSave.setBike(createdBike);

        return theftReportRepository.save(theftReportToSave);
    }
}
