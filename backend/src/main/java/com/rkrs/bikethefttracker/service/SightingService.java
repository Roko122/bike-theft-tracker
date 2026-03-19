package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.SightingRequest;
import com.rkrs.bikethefttracker.dto.SightingResponse;
import com.rkrs.bikethefttracker.entity.Sighting;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.mapper.SightingMapper;
import com.rkrs.bikethefttracker.repository.SightingRepository;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SightingService {

    private final TheftReportRepository theftReportRepository;
    private final SightingMapper sightingMapper;
    private final SightingRepository sightingRepository;

    public SightingService(TheftReportRepository theftReportRepository, SightingMapper sightingMapper, SightingRepository sightingRepository) {
        this.theftReportRepository = theftReportRepository;
        this.sightingMapper = sightingMapper;
        this.sightingRepository = sightingRepository;
    }

    public SightingResponse createSighting(SightingRequest sightingRequest, User user, UUID theftReportId) {
        TheftReport theftReport = theftReportRepository.getReferenceById(theftReportId);
        Sighting sightingToCreate = sightingMapper.toSighting(sightingRequest, user, theftReport);

        Sighting createdSighting = sightingRepository.save(sightingToCreate);

        return sightingMapper.toSightingResponse(createdSighting, user.getUsername());
    }

    public List<SightingResponse> getAllSightings(UUID theftReportId) {
        List<Sighting> sightings = sightingRepository.findByTheftReportId(theftReportId);

        return sightings.stream()
                .map(s -> sightingMapper.toSightingResponse(s, s.getReporter().getUsername()))
                .toList();
    }
}
