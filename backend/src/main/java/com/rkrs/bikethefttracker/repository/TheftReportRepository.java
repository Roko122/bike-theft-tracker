package com.rkrs.bikethefttracker.repository;

import com.rkrs.bikethefttracker.domain.TheftReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TheftReportRepository extends JpaRepository<TheftReport, UUID> {

}
