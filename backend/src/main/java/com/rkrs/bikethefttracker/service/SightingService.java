package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.SightingRequest;
import com.rkrs.bikethefttracker.dto.SightingResponse;
import com.rkrs.bikethefttracker.entity.NotificationType;
import com.rkrs.bikethefttracker.entity.Sighting;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.exception.AccessDeniedException;
import com.rkrs.bikethefttracker.exception.NotFoundException;
import com.rkrs.bikethefttracker.mapper.SightingMapper;
import com.rkrs.bikethefttracker.repository.SightingRepository;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class SightingService {

    private final TheftReportRepository theftReportRepository;
    private final SightingMapper sightingMapper;
    private final SightingRepository sightingRepository;
    private final ImageStorageService imageStorageService;
    private final NotificationService notificationService;

    public SightingService(TheftReportRepository theftReportRepository, SightingMapper sightingMapper, SightingRepository sightingRepository, ImageStorageService imageStorageService, NotificationService notificationService) {
        this.theftReportRepository = theftReportRepository;
        this.sightingMapper = sightingMapper;
        this.sightingRepository = sightingRepository;
        this.imageStorageService = imageStorageService;
        this.notificationService = notificationService;
    }

    @Transactional
    public SightingResponse createSighting(SightingRequest sightingRequest, MultipartFile image, User user, UUID theftReportId) {
        TheftReport theftReport = theftReportRepository.getReferenceById(theftReportId);
        Sighting sightingToCreate = sightingMapper.toSighting(sightingRequest, user, theftReport);

        Sighting createdSighting = sightingRepository.save(sightingToCreate);
        this.addImage(image, theftReportId, createdSighting);

        //Create a notification
        notificationService.createNotification(NotificationType.NEW_SIGHTING, theftReport.getUser(), theftReport);

        return sightingMapper.toSightingResponse(createdSighting, user.getUsername());
    }

    @Transactional(readOnly = true)
    public List<SightingResponse> getAllSightings(UUID theftReportId, User user) {
        TheftReport theftReport = theftReportRepository.findById(theftReportId).orElseThrow(() ->
                new NotFoundException("TheftReport with id " + theftReportId + " not found.")
        );

        if (!theftReport.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not allowed.");
        }

        List<Sighting> sightings = sightingRepository.findByTheftReportId(theftReportId);

        return sightings.stream()
                .map(s -> sightingMapper.toSightingResponse(s, s.getReporter().getUsername()))
                .toList();
    }

    private void addImage(MultipartFile image, UUID theftReportId, Sighting createdSighting) {
        if (image != null && !image.isEmpty()) {
            String imageName = imageStorageService.saveImage(image, "sightings", theftReportId);
            createdSighting.setImageName(imageName);
        }
    }
}
