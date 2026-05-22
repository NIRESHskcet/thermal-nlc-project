package com.thermal.nlc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thermal.nlc.model.Unit;

@Repository
public interface UnitRepo extends JpaRepository<Unit,Integer>{
    @Query("""
        SELECT u FROM Unit u
        WHERE
        CAST(u.station.stationId AS String) LIKE %:keyword% OR
        LOWER(u.station.stationName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(u.unitName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(u.capacityMW) LIKE LOWER(CONCAT('%',:keyword,'%'))
    """)
    List<Unit> searchUnit(@Param("keyword") String keyword);

    List<Unit> findByStation_StationId(Integer stationId);
    boolean existsByUnitNameIgnoreCase(String unitName);
    boolean existsByUnitNameIgnoreCaseAndUnitIdNot(String unitName, Integer unitId);
    boolean existsByUnitNameIgnoreCaseAndStation_StationId(String unitName, Integer stationId);
    boolean existsByUnitNameIgnoreCaseAndStation_StationIdAndUnitIdNot(String unitName, Integer stationId, Integer unitId);
}
