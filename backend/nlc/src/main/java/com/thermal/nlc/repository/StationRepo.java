package com.thermal.nlc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thermal.nlc.model.Station;

@Repository
public interface StationRepo extends JpaRepository<Station,Integer>{

    @Query("""
        SELECT st FROM Station st
        WHERE
        LOWER(st.stationName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(st.primaryFuelType) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(st.location) LIKE LOWER(CONCAT('%',:keyword,'%'))
    """)
    List<Station> searchStation(@Param("keyword") String keyword);

    boolean existsByStationNameIgnoreCase(String stationName);
    boolean existsByStationNameIgnoreCaseAndStationIdNot(String stationName, Integer stationId);
}
