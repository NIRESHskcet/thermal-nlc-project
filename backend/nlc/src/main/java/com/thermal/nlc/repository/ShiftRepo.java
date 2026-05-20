package com.thermal.nlc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thermal.nlc.model.Shift;
@Repository
public interface ShiftRepo extends JpaRepository<Shift,Integer>{
    @Query("""
        SELECT s FROM Shift s
        WHERE
        LOWER(s.shiftName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        CAST(s.startTime AS String) LIKE %:keyword% OR
        CAST(s.endTime AS String) LIKE %:keyword%
    """)
    List<Shift> searchShift(@Param("keyword") String keyword);
}
