package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.domain.Bike;
import com.rkrs.bikethefttracker.domain.TheftReport;
import com.rkrs.bikethefttracker.domain.User;
import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemData;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.mapper.TheftReportMapper;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TheftReportService {

    private final TheftReportRepository theftReportRepository;
    private final TheftReportMapper theftReportMapper;
    private final BikeService bikeService;
    private final UserService userService;

    public TheftReportService(TheftReportRepository theftReportRepository, TheftReportMapper theftReportMapper, BikeService bikeService, UserService userService) {
        this.theftReportRepository = theftReportRepository;
        this.theftReportMapper = theftReportMapper;
        this.bikeService = bikeService;
        this.userService = userService;
    }

    public List<TheftReportMapItemResponse> getAllTheftReportMapItems() {
        List<TheftReportMapItemData> mapItemsData = theftReportRepository.findAllTheftReportMapItems();

        return mapItemsData.stream().map(theftReportMapper::toTheftReportMapItemResponse).toList();
    }

    @Transactional
    public TheftReportResponse createTheftReport(CreateTheftReportRequest createTheftReportRequest) {
        User createdUser = userService.createUser(createTheftReportRequest.bike().user());
        Bike createdBike = bikeService.createBike(createTheftReportRequest.bike(), createdUser);

        //Create TheftReport
        TheftReport theftReportToSave = theftReportMapper.toTheftReport(createTheftReportRequest);
        theftReportToSave.setBike(createdBike);
        TheftReport theftReport = theftReportRepository.save(theftReportToSave);

        return theftReportMapper.toTheftReportResponse(theftReport);
    }
}
