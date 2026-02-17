package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.domain.TheftReport;
import com.rkrs.bikethefttracker.dto.TheftReportMapItemData;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TheftReportRepository extends JpaRepository<TheftReport, UUID> {

    @Query("""
    SELECT new com.rkrs.bikethefttracker.dto.TheftReportMapItemData(
            tp.id,
            b.brand,
            b.model,
            b.type,
            b.color,
            tp.status,
            tp.location,
            tp.theftTime
        )
        FROM TheftReport tp
            JOIN tp.bike b
    """)
    List<TheftReportMapItemData> findAllTheftReportMapItems();

    @EntityGraph(attributePaths = {"bike", "bike.user"})
    Optional<TheftReport> findById(UUID id);

    @Query("""
    SELECT new com.rkrs.bikethefttracker.dto.TheftReportMapItemData(
            tp.id,
            b.brand,
            b.model,
            b.type,
            b.color,
            tp.status,
            tp.location,
            tp.theftTime
        )
        FROM TheftReport tp
            JOIN tp.bike b
        WHERE ST_within(tp.location,
                         ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326)
               )
    """)
    List<TheftReportMapItemData> findAllVisibleTheftReportMapItems(double minLon,
                                                                   double minLat,
                                                                   double maxLon,
                                                                   double maxLat);

}
