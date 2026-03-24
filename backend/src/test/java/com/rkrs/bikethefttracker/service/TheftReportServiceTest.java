package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.entity.TheftReport;
import com.rkrs.bikethefttracker.exception.NotFoundException;
import com.rkrs.bikethefttracker.mapper.TheftReportMapper;
import com.rkrs.bikethefttracker.repository.TheftReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TheftReportServiceTest {

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

    //not up to date
//    @Test
//    @DisplayName("Palauttaa TheftReportResponse-olion kun raportti loytyy repositorysta")
//    void getTheftReportResponse_whenReportExists_returnsTheftReportResponse() {
//        UUID id = UUID.fromString("6b4027a2-2c19-4f67-88b0-1f1c05f2f4c3");
//        TheftReport theftReport = TheftReport.builder().id(id).build();
//        TheftReportResponse expectedResponse = new TheftReportResponse(id, null, null, null, null, null, null, null);
//
//        when(theftReportRepository.findById(id)).thenReturn(Optional.of(theftReport));
//        when(theftReportMapper.toTheftReportResponse(theftReport)).thenReturn(expectedResponse);
//
//        TheftReportResponse actualResponse = theftReportService.getTheftReportResponse(id);
//
//        assertEquals(id, actualResponse.id());
//        verify(theftReportRepository).findById(id);
//        verify(theftReportMapper).toTheftReportResponse(theftReport);
//    }

    @Test
    @DisplayName("Heittää NotFoundExceptionin kun raporttia ei loydy repositorysta")
    void getTheftReportResponse_whenReportDoesNotExist_throwsNotFoundException() {
        UUID missingId = UUID.fromString("b2f0e9d1-0bc9-4c8b-8c1a-6b4c2d246f0c");
        when(theftReportRepository.findById(missingId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> theftReportService.getTheftReportResponse(missingId)
        );

        assertTrue(exception.getMessage().contains(missingId.toString()));
        verify(theftReportRepository).findById(missingId);
        verify(theftReportMapper, never()).toTheftReportResponse(org.mockito.ArgumentMatchers.any(TheftReport.class));
    }
}
