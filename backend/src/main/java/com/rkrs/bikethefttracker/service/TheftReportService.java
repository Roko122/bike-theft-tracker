package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.*;
import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.exception.AccessDeniedException;
import com.rkrs.bikethefttracker.exception.NotFoundException;
import com.rkrs.bikethefttracker.mapper.GeoPointMapper;
import com.rkrs.bikethefttracker.mapper.TheftReportMapper;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.locationtech.jts.geom.Point;
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
    private final GeoPointMapper geoPointMapper;

    public TheftReportService(TheftReportRepository theftReportRepository, TheftReportMapper theftReportMapper, BikeService bikeService, ImageStorageService imageStorageService, GeoPointMapper geoPointMapper) {
        this.theftReportRepository = theftReportRepository;
        this.theftReportMapper = theftReportMapper;
        this.bikeService = bikeService;
        this.imageStorageService = imageStorageService;
        this.geoPointMapper = geoPointMapper;
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

        TheftReport createdTheftReport = this.createTheftReport(createTheftReportRequest, user);
        Bike createdBike = this.createBikeWithImages(createTheftReportRequest.bike(), images, createdTheftReport.getId());
        createdTheftReport.setBike(createdBike);
        theftReportRepository.save(createdTheftReport);

        return theftReportMapper.toTheftReportResponse(createdTheftReport);
    }

    public TheftReportResponse getTheftReportResponse(UUID id) {
        TheftReport theftReport = fetchTheftReport(id);

        return theftReportMapper.toTheftReportResponse(theftReport);
    }

    public List<TheftReportResponse> getUsersTheftReports(User user) {
        List<TheftReport> theftReports = theftReportRepository.findAllByUser(user);

        return theftReports.stream()
                .map(theftReportMapper::toTheftReportResponse)
                .toList();
    }

    @Transactional
    public TheftReportResponse updateTheftReport(UpdateTheftReportRequest updateTheftReportRequest,
                                                 User user,
                                                 UUID theftReportId) {

        //Check if ids match
        if (!updateTheftReportRequest.id().equals(theftReportId)) {
            throw new IllegalArgumentException("Request IDs do not match.");
        }

        TheftReport theftReportToUpdate = fetchTheftReport(theftReportId);
        this.checkOwnership(theftReportToUpdate, user);

        this.updateTheftReportData(theftReportToUpdate, updateTheftReportRequest);
        TheftReport updateTheftReport = theftReportRepository.save(theftReportToUpdate);

        return theftReportMapper.toTheftReportResponse(updateTheftReport);
    }

    @Transactional
    public TheftReportResponse updateStatus(UpdateStatusRequest updateStatusRequest, User user, UUID id) {
        TheftReport toUpdate = fetchTheftReport(id);
        this.checkOwnership(toUpdate, user);

        toUpdate.setStatus(updateStatusRequest.status());

        TheftReport updated = theftReportRepository.save(toUpdate);
        return theftReportMapper.toTheftReportResponse(updated);
    }

    private Bike createBikeWithImages(CreateBikeRequest bikeDto, List<MultipartFile> images, UUID theftReportId) {
        Bike createdBike = bikeService.createBike(bikeDto);

        if (images != null) {
            List<String> imagePaths = imageStorageService.saveImages(images, "bike", theftReportId);
            bikeService.addImages(createdBike, imagePaths);
        }

        return createdBike;
    }

    private TheftReport createTheftReport(CreateTheftReportRequest theftReportDto, User user) {
        TheftReport theftReportToSave = theftReportMapper.toTheftReport(theftReportDto);
        theftReportToSave.setUser(user);

        return theftReportRepository.save(theftReportToSave);
    }

    private TheftReport fetchTheftReport(UUID id) {
        return theftReportRepository.findById(id).orElseThrow(() ->
                new NotFoundException("TheftReport with id " + id + " not found")
        );
    }

    private void checkOwnership(TheftReport theftReport, User user) {
        //check if logged-in user owns theft report
        if (!theftReport.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not allowed.");
        }
    }

    private void updateTheftReportData(TheftReport toUpdate, UpdateTheftReportRequest data) {
        Bike bike = toUpdate.getBike();
        Point geoPoint = geoPointMapper.toPoint(data.location());

        toUpdate.setTheftAddress(data.theftAddress());
        toUpdate.setLocation(geoPoint);
        toUpdate.setTheftTime(data.theftTime());
        toUpdate.setDescription(data.description());

        bike.setDescription(data.bike().description());
        bike.setBrand(data.bike().brand());
        bike.setColor(data.bike().color());
        bike.setModel(data.bike().model());
        bike.setSerialNumber(data.bike().serialNumber());
        bike.setType(data.bike().type());
    }
}
