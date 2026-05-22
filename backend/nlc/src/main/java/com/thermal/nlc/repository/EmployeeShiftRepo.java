package com.thermal.nlc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thermal.nlc.model.EmployeeShift;
@Repository
public interface EmployeeShiftRepo extends JpaRepository<EmployeeShift,Integer>{
    
    @Query("""
        SELECT es FROM EmployeeShift es
        WHERE
        CAST(es.assignDate AS String) LIKE %:keyword% OR
        CAST(es.employee.id AS String) LIKE %:keyword% OR
        CAST(es.shift.id AS String) LIKE %:keyword% OR
        LOWER(es.employee.employeeName) LIKE LOWER(CONCAT('%',:keyword,'%')) OR
        LOWER(es.shift.shiftName) LIKE LOWER(CONCAT('%',:keyword,'%'))
    """)
    List<EmployeeShift> searchEmployeeShift(@Param("keyword") String keyword);

    List<EmployeeShift> findByEmployee_Id(Integer employeeId);

    List<EmployeeShift> findByShift_Id(Integer shiftId);


}
