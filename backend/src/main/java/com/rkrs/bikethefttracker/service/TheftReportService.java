package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.TheftReportMapItemData;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.mapper.TheftReportMapper;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheftReportService {

    private final TheftReportRepository theftReportRepository;
    private final TheftReportMapper theftReportMapper;

    public TheftReportService(TheftReportRepository theftReportRepository, TheftReportMapper theftReportMapper) {
        this.theftReportRepository = theftReportRepository;
        this.theftReportMapper = theftReportMapper;
    }

    public List<TheftReportMapItemResponse> getAllTheftReportMapItems() {
        List<TheftReportMapItemData> mapItemsData = theftReportRepository.findAllTheftReportMapItems();

        return mapItemsData.stream().map(theftReportMapper::toTheftReportMapItemResponse).toList();
    }
}
