package com.rkrs.bikethefttracker.service;

import com.rkrs.bikethefttracker.dto.CreateBikeRequest;
import com.rkrs.bikethefttracker.entity.Bike;
import com.rkrs.bikethefttracker.mapper.BikeMapper;
import com.rkrs.bikethefttracker.repository.BikeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BikeServiceTest {

    @Mock
    private BikeMapper bikeMapper;

    @Mock
    private BikeRepository bikeRepository;

    @InjectMocks
    private BikeService bikeService;

    @Test
    @DisplayName("createBike mapittaa pyoran, tallentaa sen ja palauttaa tallennetun pyoran")
    void createBike_success_mapsSavesAndReturnsSavedBike() {
        CreateBikeRequest request = new CreateBikeRequest(
                "Cube",
                "Nuroad",
                "Gravel",
                "Green",
                "SN-12345",
                "Lime tape"
        );
        Bike mappedBike = Bike.builder().brand("Cube").build();
        Bike savedBike = Bike.builder().brand("Cube").model("Nuroad").build();

        when(bikeMapper.toBike(request)).thenReturn(mappedBike);
        when(bikeRepository.save(mappedBike)).thenReturn(savedBike);

        Bike result = bikeService.createBike(request);

        assertEquals(savedBike, result);
        verify(bikeMapper).toBike(request);
        verify(bikeRepository).save(mappedBike);
        verifyNoMoreInteractions(bikeMapper, bikeRepository);
    }

    @Test
    @DisplayName("addImages liittaa kuvat pyoraan ja tallentaa paivitetyn pyoran")
    void addImages_addsImagesAndSavesBike() {
        Bike bike = Bike.builder().build();
        List<String> imagePaths = List.of("one.jpeg", "two.jpeg");

        bikeService.addImages(bike, imagePaths);

        assertEquals(2, bike.getImages().size());
        assertSame(bike, bike.getImages().get(0).getBike());
        assertEquals("one.jpeg", bike.getImages().get(0).getImageName());
        assertEquals("two.jpeg", bike.getImages().get(1).getImageName());

        ArgumentCaptor<Bike> bikeCaptor = ArgumentCaptor.forClass(Bike.class);
        verify(bikeRepository).save(bikeCaptor.capture());
        assertSame(bike, bikeCaptor.getValue());
        verifyNoMoreInteractions(bikeMapper, bikeRepository);
    }
}
