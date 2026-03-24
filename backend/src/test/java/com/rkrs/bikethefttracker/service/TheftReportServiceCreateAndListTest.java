package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.GeoPoint;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemData;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemResponse;
import com.rkrs.bikethefttracker.entity.Status;
import com.rkrs.bikethefttracker.mapper.TheftReportMapper;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TheftReportServiceCreateAndListTest {

    @Mock
    private TheftReportRepository theftReportRepository;

    @Mock
    private TheftReportMapper theftReportMapper;

    @Mock
    private BikeService bikeService;

    @Mock
    private UserService userService;

    @InjectMocks
    private TheftReportService theftReportService;

    @Test
    @DisplayName("getAllTheftReportMapItems palauttaa mapitetut arvot oikeassa järjestyksessä")
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
        verifyNoInteractions(bikeService, userService);
        verifyNoMoreInteractions(theftReportRepository, theftReportMapper);
    }

    @Test
    @DisplayName("getAllVisibleTheftReportMapItems käyttää bbox-parametreja ja palauttaa mapitetut arvot")
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
        verifyNoInteractions(bikeService, userService);
        verifyNoMoreInteractions(theftReportRepository, theftReportMapper);
    }
// not up to date
//    @Test
//    @DisplayName("createTheftReport luo käyttäjän ja pyörän, asettaa pyörän raporttiin ja palauttaa response-olion")
//    void createTheftReport_createsDependenciesSavesReportAndReturnsMappedResponse() {
//        CreateTheftReportRequest request = mock(CreateTheftReportRequest.class);
//        CreateBikeRequest bikeRequest = mock(CreateBikeRequest.class);
//        CreateUserRequest userRequest = mock(CreateUserRequest.class);
//
//        User createdUser = User.builder().id(UUID.fromString("34c35d8d-3d9a-47cb-b7b7-5850cddf338f")).build();
//        Bike createdBike = Bike.builder().id(UUID.fromString("7dad6703-51d6-4c54-9742-89202099253e")).build();
//        TheftReport theftReportToSave = TheftReport.builder()
//                .description("Bike stolen near station")
//                .theftAddress("Mannerheimintie 1")
//                .build();
//        TheftReport savedTheftReport = TheftReport.builder()
//                .id(UUID.fromString("0f01601f-79f6-4bd2-8ce5-d6d4b3839d14"))
//                .bike(createdBike)
//                .build();
//        TheftReportResponse expectedResponse = new TheftReportResponse(
//                savedTheftReport.getId(),
//                "Bike stolen near station",
//                null,
//                "Mannerheimintie 1",
//                null,
//                null,
//                null,
//                null
//        );
//
//        when(request.bike()).thenReturn(bikeRequest);
//        when(bikeRequest.user()).thenReturn(userRequest);
//        when(userService.createUser(userRequest)).thenReturn(createdUser);
//        when(bikeService.createBike(bikeRequest, createdUser)).thenReturn(createdBike);
//        when(theftReportMapper.toTheftReport(request)).thenReturn(theftReportToSave);
//        when(theftReportRepository.save(theftReportToSave)).thenAnswer(invocation -> {
//            TheftReport argument = invocation.getArgument(0, TheftReport.class);
//            assertSame(theftReportToSave, argument);
//            assertSame(createdBike, argument.getBike());
//            return savedTheftReport;
//        });
//        when(theftReportMapper.toTheftReportResponse(savedTheftReport)).thenReturn(expectedResponse);
//
//        TheftReportResponse actual = theftReportService.createTheftReport(request);
//
//        assertEquals(expectedResponse, actual);
//
//        verify(request, times(2)).bike();
//        verify(bikeRequest).user();
//        verify(userService).createUser(userRequest);
//        verify(bikeService).createBike(bikeRequest, createdUser);
//        verify(theftReportMapper).toTheftReport(request);
//        verify(theftReportRepository).save(theftReportToSave);
//        verify(theftReportMapper).toTheftReportResponse(savedTheftReport);
//        verifyNoMoreInteractions(request, bikeRequest, userService, bikeService, theftReportRepository, theftReportMapper);
//    }
}
