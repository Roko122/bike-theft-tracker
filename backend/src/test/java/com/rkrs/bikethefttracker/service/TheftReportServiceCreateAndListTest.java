package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
import com.rkrs.bikethefttracker.dto.CreateTheftReportRequest;
import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemData;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.dto.TheftReportResponse;
import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.entity.Status;
import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.entity.User;
import com.rkrs.bikethefttracker.mapper.GeoPointMapper;
import com.rkrs.bikethefttracker.mapper.TheftReportMapper;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TheftReportServiceCreateAndListTest {

    @Mock
    private TheftReportRepository theftReportRepository;

    @Mock
    private TheftReportMapper theftReportMapper;

    @Mock
    private BikeService bikeService;

    @Mock
    private ImageStorageService imageStorageService;

    @Mock
    private GeoPointMapper geoPointMapper;

    @InjectMocks
    private TheftReportService theftReportService;

    @Test
    @DisplayName("getAllTheftReportMapItems palauttaa mapitetut arvot oikeassa jarjestyksessa")
    void getAllTheftReportMapItems_returnsMappedValuesInCorrectOrder() {
        TheftReportMapItemData firstData = new TheftReportMapItemData(
                UUID.fromString("8e2f3f11-e23b-4ae6-a2a4-1c3f08bd3c9d"),
                "Trek",
                "Domane",
                "Road",
                "Black",
                Status.ACTIVE,
                null,
                LocalDateTime.of(2024, 2, 10, 8, 15)
        );
        TheftReportMapItemData secondData = new TheftReportMapItemData(
                UUID.fromString("f9d4385f-e5d1-4df8-a0d3-95f3fc5f4a78"),
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                Status.SIGHTED,
                null,
                LocalDateTime.of(2024, 3, 11, 10, 30)
        );
        TheftReportMapItemResponse firstResponse = new TheftReportMapItemResponse(
                firstData.id(),
                firstData.brand(),
                firstData.model(),
                firstData.type(),
                firstData.color(),
                firstData.status(),
                new GeoPoint(24.95, 60.17),
                firstData.theftTime()
        );
        TheftReportMapItemResponse secondResponse = new TheftReportMapItemResponse(
                secondData.id(),
                secondData.brand(),
                secondData.model(),
                secondData.type(),
                secondData.color(),
                secondData.status(),
                new GeoPoint(24.99, 60.19),
                secondData.theftTime()
        );

        when(theftReportRepository.findAllTheftReportMapItems()).thenReturn(List.of(firstData, secondData));
        when(theftReportMapper.toTheftReportMapItemResponse(firstData)).thenReturn(firstResponse);
        when(theftReportMapper.toTheftReportMapItemResponse(secondData)).thenReturn(secondResponse);

        List<TheftReportMapItemResponse> actual = theftReportService.getAllTheftReportMapItems();

        assertEquals(2, actual.size());
        assertEquals(List.of(firstResponse, secondResponse), actual);

        verify(theftReportRepository).findAllTheftReportMapItems();
        verify(theftReportMapper).toTheftReportMapItemResponse(firstData);
        verify(theftReportMapper).toTheftReportMapItemResponse(secondData);
        verifyNoInteractions(bikeService, imageStorageService, geoPointMapper);
        verifyNoMoreInteractions(theftReportRepository, theftReportMapper);
    }

    @Test
    @DisplayName("getAllVisibleTheftReportMapItems kayttaa bbox-parametreja ja palauttaa mapitetut arvot")
    void getAllVisibleTheftReportMapItems_withBoundingBox_returnsMappedValues() {
        double minLon = 24.80;
        double minLat = 60.10;
        double maxLon = 25.20;
        double maxLat = 60.30;

        TheftReportMapItemData firstData = new TheftReportMapItemData(
                UUID.fromString("98f72de3-2ccf-4b2d-8a8c-2ec59dbbf878"),
                "Cannondale",
                "Topstone",
                "Gravel",
                "Blue",
                Status.ACTIVE,
                null,
                LocalDateTime.of(2024, 4, 12, 7, 5)
        );
        TheftReportMapItemData secondData = new TheftReportMapItemData(
                UUID.fromString("32cdac76-343f-45f7-a566-b9dd9df7f164"),
                "Specialized",
                "Allez",
                "Road",
                "Red",
                Status.RECOVERED,
                null,
                LocalDateTime.of(2024, 4, 13, 9, 45)
        );
        TheftReportMapItemResponse firstResponse = new TheftReportMapItemResponse(
                firstData.id(),
                firstData.brand(),
                firstData.model(),
                firstData.type(),
                firstData.color(),
                firstData.status(),
                new GeoPoint(24.90, 60.20),
                firstData.theftTime()
        );
        TheftReportMapItemResponse secondResponse = new TheftReportMapItemResponse(
                secondData.id(),
                secondData.brand(),
                secondData.model(),
                secondData.type(),
                secondData.color(),
                secondData.status(),
                new GeoPoint(25.10, 60.25),
                secondData.theftTime()
        );

        when(theftReportRepository.findAllVisibleTheftReportMapItems(minLon, minLat, maxLon, maxLat))
                .thenReturn(List.of(firstData, secondData));
        when(theftReportMapper.toTheftReportMapItemResponse(firstData)).thenReturn(firstResponse);
        when(theftReportMapper.toTheftReportMapItemResponse(secondData)).thenReturn(secondResponse);

        List<TheftReportMapItemResponse> actual =
                theftReportService.getAllVisibleTheftReportMapItems(minLon, minLat, maxLon, maxLat);

        assertEquals(List.of(firstResponse, secondResponse), actual);

        verify(theftReportRepository).findAllVisibleTheftReportMapItems(minLon, minLat, maxLon, maxLat);
        verify(theftReportMapper).toTheftReportMapItemResponse(firstData);
        verify(theftReportMapper).toTheftReportMapItemResponse(secondData);
        verifyNoInteractions(bikeService, imageStorageService, geoPointMapper);
        verifyNoMoreInteractions(theftReportRepository, theftReportMapper);
    }

    @Test
    @DisplayName("createTheftReport luo raportin, pyoran ja kuvat seka palauttaa response-olion")
    void createTheftReport_createsDependenciesSavesReportAndReturnsMappedResponse() {
        CreateBikeRequest bikeRequest = new CreateBikeRequest(
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                "SN-12345",
                "Lime tape"
        );
        CreateTheftReportRequest request = new CreateTheftReportRequest(
                "Bike stolen near station",
                LocalDateTime.of(2024, 3, 4, 5, 6, 7),
                "Mannerheimintie 1",
                new GeoPoint(24.9384, 60.1699),
                bikeRequest
        );
        User user = User.builder().id(UUID.fromString("34c35d8d-3d9a-47cb-b7b7-5850cddf338f")).build();
        MultipartFile firstImage = org.mockito.Mockito.mock(MultipartFile.class);
        MultipartFile secondImage = org.mockito.Mockito.mock(MultipartFile.class);
        List<MultipartFile> images = List.of(firstImage, secondImage);

        TheftReport theftReportToSave = TheftReport.builder()
                .description("Bike stolen near station")
                .theftAddress("Mannerheimintie 1")
                .build();
        TheftReport createdTheftReport = TheftReport.builder()
                .id(UUID.fromString("0f01601f-79f6-4bd2-8ce5-d6d4b3839d14"))
                .description("Bike stolen near station")
                .theftAddress("Mannerheimintie 1")
                .user(user)
                .build();
        Bike createdBike = Bike.builder()
                .id(UUID.fromString("7dad6703-51d6-4c54-9742-89202099253e"))
                .build();
        TheftReportResponse expectedResponse = new TheftReportResponse(
                createdTheftReport.getId(),
                "Bike stolen near station",
                request.theftTime(),
                "Mannerheimintie 1",
                request.location(),
                null,
                null,
                null,
                List.of("first.jpeg", "second.jpeg")
        );

        when(theftReportMapper.toTheftReport(request)).thenReturn(theftReportToSave);
        when(theftReportRepository.save(theftReportToSave)).thenReturn(createdTheftReport);
        when(bikeService.createBike(bikeRequest)).thenReturn(createdBike);
        when(imageStorageService.saveImages(images, "bike", createdTheftReport.getId()))
                .thenReturn(List.of("first.jpeg", "second.jpeg"));
        when(theftReportRepository.save(createdTheftReport)).thenReturn(createdTheftReport);
        when(theftReportMapper.toTheftReportResponse(createdTheftReport)).thenReturn(expectedResponse);

        TheftReportResponse actual = theftReportService.createTheftReport(request, user, images);

        assertEquals(expectedResponse, actual);
        assertSame(user, theftReportToSave.getUser());
        assertSame(createdBike, createdTheftReport.getBike());

        verify(theftReportMapper).toTheftReport(request);
        verify(theftReportRepository).save(theftReportToSave);
        verify(bikeService).createBike(bikeRequest);
        verify(imageStorageService).saveImages(images, "bike", createdTheftReport.getId());
        verify(bikeService).addImages(createdBike, List.of("first.jpeg", "second.jpeg"));
        verify(theftReportRepository).save(createdTheftReport);
        verify(theftReportMapper).toTheftReportResponse(createdTheftReport);
        verifyNoInteractions(geoPointMapper);
        verifyNoMoreInteractions(theftReportRepository, theftReportMapper, bikeService, imageStorageService);
    }

    @Test
    @DisplayName("createTheftReport ohittaa kuvatallennuksen kun kuvia ei anneta")
    void createTheftReport_withoutImages_skipsImageStorage() {
        CreateBikeRequest bikeRequest = new CreateBikeRequest(
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                "SN-12345",
                "Lime tape"
        );
        CreateTheftReportRequest request = new CreateTheftReportRequest(
                "Bike stolen near station",
                LocalDateTime.of(2024, 3, 4, 5, 6, 7),
                "Mannerheimintie 1",
                new GeoPoint(24.9384, 60.1699),
                bikeRequest
        );
        User user = User.builder().id(UUID.fromString("b0a7f4f0-faf0-455c-aeb5-7e35726925a6")).build();
        TheftReport theftReportToSave = TheftReport.builder().build();
        TheftReport createdTheftReport = TheftReport.builder()
                .id(UUID.fromString("a992f68f-5a48-4540-84f2-b1f2f6243657"))
                .build();
        Bike createdBike = Bike.builder().id(UUID.fromString("f146b706-5d12-4adc-ab24-8de6ed5d3d20")).build();
        TheftReportResponse expectedResponse = new TheftReportResponse(
                createdTheftReport.getId(), null, null, null, null, null, null, null, List.of()
        );

        when(theftReportMapper.toTheftReport(request)).thenReturn(theftReportToSave);
        when(theftReportRepository.save(theftReportToSave)).thenReturn(createdTheftReport);
        when(bikeService.createBike(bikeRequest)).thenReturn(createdBike);
        when(theftReportRepository.save(createdTheftReport)).thenReturn(createdTheftReport);
        when(theftReportMapper.toTheftReportResponse(createdTheftReport)).thenReturn(expectedResponse);

        TheftReportResponse actual = theftReportService.createTheftReport(request, user, null);

        assertEquals(expectedResponse, actual);
        assertSame(createdBike, createdTheftReport.getBike());

        verify(theftReportMapper).toTheftReport(request);
        verify(theftReportRepository).save(theftReportToSave);
        verify(bikeService).createBike(bikeRequest);
        verify(theftReportRepository).save(createdTheftReport);
        verify(theftReportMapper).toTheftReportResponse(createdTheftReport);
        verifyNoInteractions(imageStorageService, geoPointMapper);
        verifyNoMoreInteractions(theftReportRepository, theftReportMapper, bikeService);
    }
}
